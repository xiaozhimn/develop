var tools = require("../common/tools").tools;
var watchService = require("../biz/watchService").watchService;
exports.watcher = function(req, res, callback) {
    var pageName = req.path;
    var userName = tools.getCookieVal(req, "username") ? tools.getCookieVal(req, "username") : "anonymous";
    var agentID = "pc";
    if(req.headers["user-agent"]) {
        var deviceAgent = req.headers["user-agent"].toLowerCase();
        if(deviceAgent.match(/(iphone)/)) {
            agentID = "iphone";
        } else if(deviceAgent.match(/(ipod)/)) {
            agentID = "ipod";
        } else if(deviceAgent.match(/(ipad)/)) {
            agentID = "ipad";
        } else if(deviceAgent.match(/(android)/)) {
            agentID = "android";
        }
    }
    if(pageName.indexOf("widget") > -1 || pageName.indexOf("components") > -1 || pageName.indexOf("api/v1") > -1 || pageName.indexOf("Action") > -1 || pageName.indexOf("images") > -1) {
        callback();
        return;
    }
    pageName = pageName.substring(1, pageName.length);
    if(!pageName) {
        pageName = "index";
    }
    watchService.addVisitor({
        userName: userName,
        pageName: pageName,
        ip: tools.getClientIp(req),
        deviceAgent: agentID
    }, function(result) {
        callback(result);
    });
}