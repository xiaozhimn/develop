var cookies = require("./cookies").cookies;
var tools = {
    getCookieVal: function(req, key) {
        var cookie = req.headers ?  req.headers.cookie : "";
        if(cookie) {
            cookie = cookie.split(";");
            for(var index = 0; index < cookie.length; index++) {
                var k = cookie[index].split("=")[0];
                var v = cookie[index].split("=")[1];
                if(k.replace(/(^\s*)|(\s*$)/g, "") == key) {
                    return v;
                }
            }
        } else {
            return "";
        }
    },
    getClientIp: function(req) {
        var clientIp = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        if(clientIp.indexOf("f:") > -1) {
            return clientIp.split("f:")[1];
        } else {
            return clientIp;
        }
    },
    success: function(result) {
        return {"errorCode": "0", "msg": "请求成功", "data": result};
    },
    error: function(errorMsg) {
        return {"errorCode": "-1", "msg": errorMsg};
    },
    loginFirst: function() {
        return {"errorCode": 401, "msg": "please login first!"};
    },
    getUserId: function(res) {
        var userId = cookies.get(res, "userId");
        return userId;
    },
    checkUserAuthValide: function(req, callback) {
        var token = cookies.get(req, "token");
        var userId = cookies.get(req, "userId");
        if(!token || !userId) {//代表用户身份无效
            callback(false);
        }
        redisConn.get(userId, function(err, tk) {
            redisConn.get(token, function(err, uid) {
                 if(tk.trim() != token.trim() || uid.trim() != userId.trim()) {
                     callback(false);
                } else {
                     callback(userId);
                 }
            });
        });
    }
}
exports.tools = tools;
