var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.userinfo = function(req, res) {
    use(["public/pages/userinfo/store.js", "public/pages/userinfo/userinfo.js", "public/pages/userinfo/userinfoService.js"], function(store, app, userinfoService) {
        var storage = {};//前后端共享数据
        var state = {};//所有组件共享数据
        if(req.headers && req.headers.cookie) {
            var cookies = req.headers.cookie;
            var cookies = cookies.split(";");
            for(var index = 0; index < cookies.length; index++) {
                var item = cookies[index].split("=");
                var key = item[0];
                var val = item[1];
                if(replaceAll(key, " ", "") == 'username') {
                    storage["username"] = val;
                }
            }
        }
        renderEngin.call(res, 'userinfo', app, storage, state, store);
    }, "userinfo");
}