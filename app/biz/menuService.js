var menuDao = require("../dao/menu").menu;
var tools = require("../common/tools").tools;
var menuService = {
    getMenuTree: function(params, callback) {
        menuDao.select(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("　服务器错误!"));
            }
        });
    },
    getModule: function(params, callback) {
        var platId = params.platId;
        if(!platId) {
            callback(tools.error("　参数不正确!"));
            return;
        }
        menuDao.selectChildMenuItem(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("　服务器错误!"));
            }
        });
    },
    selectArticalMenuItem: function(params, callback) {
        var platId = params.platId;
        if(!platId) {
            callback(tools.error("　参数不正确!"));
            return;
        }
        menuDao.selectArticalMenuItem(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("　服务器错误!"));
            }
        });
    },
    getTop10ArticalList: function(params, callback) {
        menuDao.getTop10ArticalList(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    }
}
exports.menuService = menuService;