var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.errorPage = function(req, res) {
    use(["public/pages/errorPage/store.js", "public/pages/errorPage/errorPage.js", "public/pages/errorPage/errorPageService.js"], function(store, app, errorPageService) {
        var storage = {};//前后端共享数据
        var state = {};//所有组件共享数据
        renderEngin.call(res, 'errorPage', app, storage, state, store);
    }, "errorPage");
}