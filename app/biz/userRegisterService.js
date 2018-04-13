var userDao = require("../dao/user").user;
var tools = require("../common/tools").tools;
var userRegisterService = {
    regist: function(params, callback) {
        var username = params.username;
        var password = params.password;
        if(typeof username == "undefined" || typeof password == "undefined") {
            callback(tools.error("用户名或密码不能为空!"));
            return;
        }
        if(!username.trim() || !password.trim()) {
            callback(tools.error("用户名或密码不能为空!"));
        } else if(password.trim().length < 6) {
            callback(tools.error("密码最少是6位!"));
        } else {
            userDao.checkUserRegisted(params, function(result) {
                if(result.data) {//已经注册
                    callback(tools.error("用户名已存在!"));
                } else {//没有注册
                    userDao.addAuser(params, function(result) {
                        callback(result);
                    });
                }
            });
        }
    }
}
exports.userRegisterService = userRegisterService;