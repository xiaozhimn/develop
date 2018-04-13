var tools = require("../common/tools").tools;
var tplDao = require("../dao/tpl").tpl;
var tplService = {
    publish: function(params, callback) {
        var userId = params.userId;
        var name = params.name;
        var content = params.content;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!name || !content) {
            callback(tools.error("发布信息不能为空!"));
            return;
        }
        tplDao.add(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("您没有权限发布文章"));
            }
        });
    },
    getTplList: function(callback) {
        tplDao.queryTplList(function(result) {
            callback(result);
        });
    },
    getTplSigleContent: function(params, callback) {
        tplDao.queryTplSigleContent(params, function(result) {
            callback(result);
        });
    },
    deleteTpl: function(params, callback) {
        tplDao.deleteTpl(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("您没权限删除或服务器错误！"));
            }
        });
    },
    saveStyleContent: function(params, callback) {
        tplDao.saveStyleContent(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("您没权限保存或服务器错误！"));
            }
        });
    },
    getStyleContent: function(callback) {
        tplDao.getStyleContent(function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器错误！"));
            }
        });
    }
}
exports.tplService = tplService;