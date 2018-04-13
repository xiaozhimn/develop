var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.tpl = function(req, res) {
    use(["public/pages/tpl/store.js", "public/pages/tpl/tpl.js", "public/pages/tpl/tplService.js"], function(store, app, tplService) {
        var id = req.query.id;
        var storage = {
            'name': "",
            'isShowTpl': true,
            'styleContent': ""
        };//前后端共享数据
        var state = {};//所有组件共享数据
        function getTplMenuList(done) {
            tplService.getTplMenuList(function(result) {
                done(null, result)
            });
        }
        function getTplContent(done) {
            if(id) {
                tplService.getTplSigleContent({
                    urlParams: {
                        id: id
                    }
                }, function (result) {
                    done(null, result);
                })
            } else {
                done(null, {});
            }
        }
        function getStyleContent(done) {
            tplService.getStyleContent(function(result) {
                done(null, result);
            });
        }
        async.auto({
            menuList: getTplMenuList,
            tplContent: getTplContent,
            styleContent: getStyleContent
        }, function(err, response) {
            storage["menuList"] = response.menuList;
            storage["tplContent"] = response.tplContent;
            storage["styleContent"] = response.styleContent.data;
            if(response.tplContent.name) {
                storage["name"] = response.tplContent.name;
            }
            renderEngin.call(res, 'tpl', app, storage, state, store);
        });
    }, "tpl");
}