var tools = require("../common/tools").tools;
var articalDao = require("../dao/artical").artical;
var articalService = {
    publish: function(params, callback) {
        var platFormId = params.platFormId;
        var moduleId = params.moduleId;
        var name = params.name;
        var desc = params.desc;
        var content = params.content;
        var userId = params.userId;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!platFormId || !name || !desc || !content) {
            callback(tools.error("发布信息不能为空!"));
            return;
        } else if(desc.length > 200) {
            callback(tools.error("描述信息不能超过200个字!"));
            return;
        } else if(name.length > 50) {
            callback(tools.error("名称不能超过50个字!"));
            return;
        } else {
            articalDao.add(params, function(result) {
                if(result) {
                    callback(tools.success(result));
                } else {
                    callback(tools.error("您没有权限发布文章"));
                }
            });
        }
    },
    editArtical: function(params, callback) {
        var platFormId = params.platFormId;
        var moduleId = params.moduleId;
        var name = params.name;
        var desc = params.desc;
        var content = params.content;
        var userId = params.userId;
        var articalId = params.articalId;
        if(!articalId) {
            callback(tools.error("文章不存在，无法编辑!"));
            return;
        }
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!platFormId || !name || !desc || !content) {
            callback(tools.error("发布信息不能为空!"));
            return;
        } else if(desc.length > 200) {
            callback(tools.error("描述信息不能超过200个字!"));
            return;
        } else if(name.length > 50) {
            callback(tools.error("名称不能超过50个字!"));
            return;
        } else {
            articalDao.update(params, function(result) {
                if(result) {
                    callback(tools.success(result));
                } else {
                    callback(tools.error("服务器异常!"));
                }
            });
        }
    },
    deleteArtical: function(params, callback) {
        var userId = params.userId;
        var articalId = params.articalId;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!articalId) {
            callback(tools.error("文章不存在，无法删除!"));
            return;
        }
        articalDao.delete(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    },
    getSingleArticalContent: function(params, callback) {
        var userId = params.userId;
        var articalId = params.articalId;
        if(!articalId) {
            callback(tools.error("文章不存在，无法获取文章内容!"));
            return;
        }
        articalDao.selectOne(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    },
    getUserPublishedArticalList: function(params, callback) {
        var userId = params.userId;
        var currentPage = params.currentPage;
        params.pageSize = 10;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!currentPage) {
            currentPage = 1;
        }
        if(currentPage < 1 || isNaN(currentPage)) {
            callback(tools.error("参数异常"));
            return;
        }
        params.currentPage = currentPage;
        articalDao.selectArticals(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    },
    searchUserSelfPublishedArtical: function(params, callback) {
        var userId = params.userId;
        var currentPage = params.currentPage;
        params.pageSize = 10;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!currentPage) {
            currentPage = 1;
        }
        if(currentPage < 1 || isNaN(currentPage)) {
            callback(tools.error("参数异常"));
            return;
        }
        params.currentPage = currentPage;
        articalDao.queryArticalByPlatFormIdOrKeyWord(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    },
    getPrevAndNextArticalId: function(params, callback) {
        var articalId = params.articalId;
        if (!articalId) {
            callback(tools.error("当前文章不存在"));
            return;
        }
        articalDao.getPrevAndNextArticalId(params, function (result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    }
}
exports.articalService = articalService;