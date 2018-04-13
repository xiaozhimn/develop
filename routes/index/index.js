var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.index = function(req, res) {
    use(["public/pages/index/store.js", "public/pages/index/index.js", "public/pages/index/indexService.js"], function(store, app, indexService) {
        var deviceAgent = req.headers["user-agent"].toLowerCase();
        var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
        if(agentID) {
            res.redirect("http://m.uyi2.com:8006");
            return;
        }
        var storage = {};//前后端共享数据
        var state = {};//所有组件共享数据
        indexService.getNewMovieList(function(result) {
             storage["newMovieList"] = result.data;
             indexService.getTop20Artical(function(result) {
                storage["articalList"] = result.data;
                renderEngin.call(res, 'index', app, storage, state, store);
            });
        });
    }, "index");
}