var db = require("../common/connect");
var tools = require("../common/tools").tools;
var user = {
    addAuser: function(params, callback) {
        var conn = db.connect();
        conn.query('insert into user(username, password) values("'+params.username+'","' + params.password + '"' + ')', function(err) {
            if(err) {
                callback(tools.error("服务器错误!"));
            } else {
                callback(tools.success(true));
            }
        });
    },
    checkUserRegisted: function(params, callback) {
        var conn = db.connect();
        conn.query('select id from user where username="' + params.username +'"', function(err, rows, fields) {
            if(err) {
                callback(tools.error("服务器错误!"));
            } else {
                if(rows.length > 0) {
                    callback(tools.success(true));
                } else {
                    callback(tools.success(false));
                }
            }
        });
    },
    checkUserAuthOk: function(params, callback) {
        var conn = db.connect();
        conn.query('select id from user where username="' + params.username +'" and password="'+ params.password +'"', function(err, rows, fields) {
            if(err) {
                callback(tools.error("服务器错误!"));
                return;
            }
            var userId = rows[0] ? rows[0].id : "";
            callback(userId);
        });
    }
}
exports.user = user;