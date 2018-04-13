var userRegisterService = require("../biz/userRegisterService").userRegisterService;
var tools = require("../common/tools").tools;
exports.userRegister = function(req, res) {
    var username = req.param("username");
    var password = req.param("password");
    userRegisterService.regist({
        username: username,
        password: password
    }, function(result) {
        res.json(result);
    });
}