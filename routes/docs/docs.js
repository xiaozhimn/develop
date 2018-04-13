var async = require("async");
var renderEngin = require("../common/renderEngin");
var marked = require('marked');
var highlight = require('highlight.js');
var tools = require('../common/tools');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: true,
  xhtml: true,
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

exports.docs = function(req, res) {
    use(["public/pages/docs/store.js", "public/pages/docs/docs.js", "public/pages/docs/docsService.js"], function(store, app, docsService) {
        var storage = {};//前后端共享数据
        var state = {};//所有组件共享数据
        var articalId = req.query.id || -1;

        function getSingleArtical(done) {
            var config = {
              headers: req.headers,
              urlParams: {
                  articalId: articalId
              }
            };
            docsService.getSingleArticalContent(config, function(response){
              done(null, response);
            });
        }
        function getPrevAndNextArticalId(done) {
            var config = {
                headers: req.headers,
                urlParams: {
                    articalId: articalId
                }
            };
            docsService.getPrevAndNextArticalId(config, function(response){
                done(null, response);
            });
        }
        function getCommentForArtial(done) {
            var config = {
                headers: req.headers,
                urlParams: {
                    articalId: articalId
                }
            };
            docsService.getCommentForArtical(config, function(response) {
                done(null, response);
            });
        }
        function getSliderData(done) {
          tools.getSliderData(function(response){
            done(null, response);
          });
        }
        function getArticalMenuItems(result, done) {
            var platId = result.artical.errorCode == 0 ? result.artical.data.plat_id : -1
            if (!platId || platId === -1) {
              done(null, {errorCode: -1});
              return
            }
            var config = {
                urlParams: {
                    platId: platId
                }
            };
            docsService.getArticalMenuItems(config, function(response){
              done(null, response);
            });
        }
        // function getSubMenuData(result, done, type) {
        //     var id = result.artical.errorCode == 0 ? result.artical.data[type] : -1
        //     if (!id || id === -1) {
        //       done(null, {errorCode: -1});
        //       return
        //     }
        //     tools.getSubMenuData(id, function(response){
        //       done(null, response);
        //     }
        // }
        function getArticalSubMenuItems(result, done) {
            var moduleId = result.artical.errorCode == 0 ? result.artical.data.module_id : -1
            if (!moduleId || moduleId === -1) {
              done(null, {errorCode: -1});
              return
            }
            var config = {
                urlParams: {
                    platId: moduleId
                }
            };
            docsService.getArticalMenuItems(config, function(response){
              done(null, response);
            });
        }
        function addMenuItems(array, subArray, id) {
          if (!array || !subArray || !array.length || !subArray.length) {
            return
          }
          return array.find(function(item){
            if (item.id && Number(item.id) === Number(id)) {
              item["children"] = subArray;
              item["isActive"] = true;
              item["touched"] = true;
              return item;
            }
          })
        }
        function checkIsArticalExist(errorCode){
          if (errorCode !== 0 && errorCode !== "0") {
            res.redirect("/errorPage");
          }
        }

        async.auto({
            artical: getSingleArtical,
            preAndNextArtical: getPrevAndNextArticalId,
            comment: getCommentForArtial,
            sliderData: getSliderData,
            menuItems: ["artical", getArticalMenuItems],
            subMenuItems: ["artical", getArticalSubMenuItems]
        }, function (err, response) {
            var artical = response.artical ? response.artical : {data: {content: ""}};
            var comment = response.comment ? response.comment : {data: {}};
            var preAndNextArtical = response.preAndNextArtical ? response.preAndNextArtical : {data: {}};
            var sliderData = response.sliderData ? response.sliderData : {data: []};
            var menuItems = response.menuItems ? response.menuItems : {data: []};
            var subMenuItems = response.subMenuItems ? response.subMenuItems : {data: []};
            var platId = artical.errorCode == 0 ? artical.data.plat_id : -1;
            var moduleId = artical.errorCode == 0 ? artical.data.module_id : -1;
            var subMenuObj;
            if(artical.data["content"]) {
                artical.data["content"] = decodeURIComponent(artical.data["content"]);
            }
            checkIsArticalExist(artical.errorCode);
            storage["platId"] = platId;
            storage["moduleId"] = moduleId;
            storage["articalId"] = articalId;
            storage["pageTitle"] = artical.data["name"];
            storage["articalData"] = artical.errorCode == 0 ? artical.data : {};
            storage["pageContent"] = artical.errorCode == 0 ? marked(artical.data.content.toString()) : "";
            storage["pageComment"] = comment.errorCode == 0 ? comment.data : {};
            storage["preAndNextArtical"] = preAndNextArtical.errorCode == 0 ? preAndNextArtical.data : {};
            storage["sliderData"] = sliderData.errorCode == 0 ? sliderData.data : [];
            storage["menuItems"] = menuItems.errorCode == 0 ? menuItems.data : [];
            if (platId && platId !== -1 && sliderData.errorCode == 0 && menuItems.errorCode == 0) {
              subMenuObj = addMenuItems(storage["sliderData"], menuItems.data, platId);
            }
            if (moduleId && moduleId !== -1 && sliderData.errorCode == 0 && menuItems.errorCode == 0 && subMenuItems.errorCode == 0 && subMenuObj) {
              addMenuItems(subMenuObj.children, subMenuItems.data, moduleId);
            }
            renderEngin.call(res, 'docs', app, storage, state, store);
        })
    }, "docs");
}
