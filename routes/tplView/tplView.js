var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.tplView = function(req, res) {
    use(["public/pages/tplView/store.js", "public/pages/tplView/tplView.js", "public/pages/tplView/tplViewService.js"], function(store, app, tplViewService) {
        var storage = {
            "code": ""
        };//前后端共享数据
        var state = {};//所有组件共享数据
        renderEngin.call(res, 'tplView', app, storage, state, store);
    }, "tplView");
}