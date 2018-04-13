var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.tplList = function(req, res) {
    use(["public/pages/tplList/store.js", "public/pages/tplList/tplList.js", "public/pages/tplList/tplListService.js"], function(store, app, tplListService) {
        var storage = {};//前后端共享数据
        var state = {};//所有组件共享数据
        tplListService.getTplMenuList(function(result) {
            storage["menuList"] = result;
            renderEngin.call(res, 'tplList', app, storage, state, store);
        });
    }, "tplList");
}