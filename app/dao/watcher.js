var db = require("../common/connect");
var tools = require("../common/tools").tools;
var watcher = {
    addVisitor: function(params, callback) {
        var conn = db.connect();
        var pageName = params.pageName || "未知页面";
        var ip = params.ip || "未知ip";
        var userName = params.userName;
        var deviceAgent = params.deviceAgent;
        conn.query('insert into watch(page_name,ip,user_name,device) value("' + pageName + '", "' + ip + '","' + userName + '","' + deviceAgent + '")', function(err) {
            if(err) {
                callback(tools.error("服务器错误!"));
                return;
            }
            callback(tools.success("操作正确"));
        });
    }
}
exports.watcher = watcher;