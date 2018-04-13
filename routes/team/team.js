var async = require("async");
var renderEngin = require("../common/renderEngin");
var tools = require("../common/tools");
exports.team = function(req, res) {
    use(["public/pages/team/store.js", "public/pages/team/team.js", "public/pages/team/teamService.js"], function(store, app, teamService) {
        var storage = {};//前后端共享数据
        var state = {};//所有组件共享数据
        var members = [{
          avatar: "images/team/zfb20180227.jpg",
          name: "朱冯博",
          focus: [{name:"UE2/*", link:"https://github.com/"}],
          position: "R&D 研发经理，技术架构，框架作者",
          institute: {name:"上海至精供应链", link:"http://www.hnagroup.com/industries/techlogistics/"},
          city: "西安",
          languages: ["中文", "English"],
          links: [{name:"zfbandmm@126.com", href:"mailto:zfbandmm@126.com"}]
        },{
          avatar: "images/team/ymh20180227.jpg",
          name: "叶萌华",
          focus: [{name:"UE2/*", link:"https://github.com/"}],
          position: "前端开发工程师，组件库开发者",
          institute: {name:"上海至精供应链", link:"http://www.hnagroup.com/industries/techlogistics/"},
          city: "西安",
          languages: ["中文", "English"],
          links: [{name:"april1984417@163.com", href:"mailto:april1984417@163.com"}, {name:"april_4的博客", href:"http://blog.csdn.net/april_4"}]
        },{
          avatar: "images/team/lt20180227.jpg",
          name: "刘涛",
          focus: [{name:"UE2/*", link:"https://github.com/"}],
          position: "前端开发工程师，组件库开发者",
          institute: {name:"文思海辉", link:"http://www.pactera.com/"},
          city: "西安",
          languages: ["中文", "English"],
          links: []
        },{
          avatar: "images/team/rs20180227.jpg",
          name: "任帅",
          focus: [{name:"UE2/*", link:"https://github.com/"}],
          position: "前端开发工程师，组件库开发者",
          institute: {name:"文思海辉", link:"http://www.pactera.com/"},
          city: "西安",
          languages: ["中文", "English"],
          links: []
        },{
          avatar: "images/team/zq20180227.jpg",
          name: "张奇",
          focus: [{name:"UE2/*", link:"https://github.com/"}],
          position: "前端开发工程师，组件库开发者",
          institute: {name:"上海至精供应链", link:"http://www.hnagroup.com/industries/techlogistics/"},
          city: "西安",
          languages: ["中文", "English"],
          links: []
        },{
          avatar: "images/team/wr20180227.jpg",
          name: "王瑞",
          focus: [{name:"UE2/*", link:"https://github.com/"}],
          position: "前端开发工程师，组件库开发者",
          institute: {name:"上海至精供应链", link:"http://www.hnagroup.com/industries/techlogistics/"},
          city: "西安",
          languages: ["中文", "English"],
          links: []
        },{
          avatar: "images/team/lzx20180227.jpg",
          name: "栾铸显",
          focus: [{name:"UE2/*", link:"https://github.com/"}],
          position: "前端开发工程师，组件库开发者",
          institute: {name:"上海至精供应链", link:"http://www.hnagroup.com/industries/techlogistics/"},
          city: "西安",
          languages: ["中文", "English"],
          links: [{name:"luanzhuxian@hotmail.com", href:"mailto:luanzhuxian@hotmail.com"}]
        }];

        function getSliderData(done){
          tools.getSliderData(function(response){
            done(null, response);
          });
        }

        async.parallel({
            sliderData: getSliderData
        }, function (err, response) {
            var sliderData = response.sliderData ? response.sliderData : {data: {}};
            storage["platId"] = "team";
            storage["members"] = members;
            storage["sliderData"] = sliderData.errorCode == 0 ? sliderData.data : [];
            renderEngin.call(res, 'team', app, storage, state, store);
        })
    }, "team");
}
