var tools = require("../common/tools").tools;
var cookies = require("../common/cookies").cookies;
exports.checkLogin = function(req, res) {
    var token = req.param("token");
    var tk = cookies.get(req, "token");
    if(token == tk) {
        res.json({"errorCode":"0", "msg":"user has logined", data:true});
    } else {
        res.json({"errorCode":"0", "msg":"user did not login", data:false});
    }
}