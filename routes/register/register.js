var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.register = function(req, res) {
    use(["public/pages/register/store.js", "public/pages/register/register.js", "public/pages/register/registerService.js"], function(store, app, registerService) {
        var storage = {};//前后端共享数据
        var state = {};//所有组件共享数据
        renderEngin.call(res, 'register', app, storage, state, store);
    }, "register");
}