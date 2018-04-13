var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.login = function(req, res) {
    use(["public/pages/login/store.js", "public/pages/login/login.js", "public/pages/login/loginService.js"], function(store, app, loginService) {
        var storage = {};//前后端共享数据
        var state = {};//所有组件共享数据
        renderEngin.call(res, 'login', app, storage, state, store);
    }, "login");
}