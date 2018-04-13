var userDao = require("../dao/user").user;
var tools = require("../common/tools").tools;
var loginService = {
    login: function(params, callback) {
        var username = params.username;
        var password = params.password;
        userDao.checkUserAuthOk(params, function(result) {
            if(result) {//说明用户名密码正确
                callback(tools.success({
                    userId: result,
                    username: username
                }));
            } else {//用户名密码错误
                callback(tools.error("用户名或密码错误!"));
            }
        });
    }
}
exports.loginService = loginService;