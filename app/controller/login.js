var loginService = require("../biz/loginService").loginService;
var tools = require("../common/tools").tools;
var TokenGenerator = require('uuid-token-generator');
var tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
exports.login = function(req, res) {
    var username = req.param("username");
    var password = req.param("password");
    loginService.login({
        username: username,
        password: password
    }, function(result) {
        if(result.data) {
            var userId = result.data.userId;
            var uuid = tokgen.generate();
            redisConn.set(userId, uuid);
            redisConn.set(uuid, userId);
            res.cookie('token', uuid, { expires: new Date(Date.now() + 24 *60 * 60 * 1000)});
            res.cookie('userId', userId, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000)});
            res.cookie('username', result.data.username, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000)});
        }
        res.json(result);
    });
}