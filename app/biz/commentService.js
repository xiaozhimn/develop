var tools = require("../common/tools").tools;
var commentDao = require("../dao/comment").comment;
var commentService = {
    publishCommentForAtical: function(params, callback) {
        var userId = params.userId;
        var articalId = params.articalId;
        var content = params.content;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!articalId) {
            callback(tools.error("文章不存在，无法评论!"));
            return;
        }
        if(!content) {
            callback(tools.error("评论内容不能为空!"));
            return;
        }
        if(content.length > 500) {
            callback(tools.error("评论内容不能超过500字!"));
            return;
        }
        commentDao.add(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    },
    thumbUp: function(params, callback) {
        var articalId = params.articalId;
        var userId = params.userId;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!articalId) {
            callback(tools.error("文章不存在，无法点赞!"));
            return;
        }
        commentDao.thumbUp(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    },
    replyCommenter: function(params, callback) {
        var commentId = params.commentId;
        var userId = params.userId;
        var content = params.content;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!commentId) {
            callback(tools.error("评论不存在，无法回复!"));
            return;
        }
        if(!content || !content.trim()) {
            callback(tools.error("回复内容不能为空!"));
            return;
        }
        if(content.trim().length > 500) {
            callback(tools.error("回复内容不能超过500个字!"));
            return;
        }
        commentDao.replyCommenter(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    },
    getCommentForArtical: function(params, callback) {
        var articalId = params.articalId;
        if(!articalId) {
            callback(tools.error("缺省articalId，无法获取评论!"));
            return;
        }
        commentDao.queryCommenters(params, function(result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("服务器异常!"));
            }
        });
    }
}
exports.commentService = commentService;