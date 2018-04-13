var db = require("../common/connect");
var tools = require("../common/tools").tools;
var comment = {
    add: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var articalId = params.articalId;
        var content = params.content;
        conn.query('insert into comment(artical_id,commenter_id,comment_content) values(' + articalId + ',' + userId + ',"' + content + '")', function(err, rows) {
            if(err) {
                callback(false);
            } else {
                conn.query('select max(id) as id from comment', function(err, rows) {
                    if(err) {
                        callback(false);
                    } else {
                        callback({
                            id: rows[0].id
                        });
                    }
                });
            }
        });
    },
    thumbUp: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var articalId = params.articalId;
        conn.query('insert into thumb_up(artical_id,thumb_up_user_id) values('+ articalId + ',' + userId + ')', function(err, rows) {
            if(err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    },
    replyCommenter: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var commentId = params.commentId;
        var content = params.content;
        conn.query('insert into replier(comment_id,replier_id,content) values('+ commentId + ',' + userId + ',"' + content + '")', function(err, rows) {
            if(err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    },
    queryCommenters: function(params, callback) {
        var conn = db.connect();
        var articalId = params.articalId;
        function buildResult(rows, list, commentId) {
            var flag = false;
            for(var index = 0; index < rows.length; index++) {
                if(rows[index].id == commentId) {
                    flag = true;
                    rows[index].replerList = list;
                    break;
                }
            }
            if(!flag) {
                rows[index].replerList = [];
            }
        }
        conn.query("select count(id) as thumbUpCount from thumb_up where artical_id=" + articalId, function(err, results) {
            var thumUpCount = results.length > 0 ? results[0].thumbUpCount : 0;
            conn.query('select comment.id,user.username,comment.comment_content,comment.create_time from comment,user where comment.artical_id=' + articalId + " and comment.commenter_id=user.id", function(err, rows) {
                if(rows.length == 0) {
                    rows = {
                        list: [],
                        thumUpCount: thumUpCount
                    };
                    callback(rows);
                    return;
                }
                rows.forEach(function(item, index) {
                    var commentId = item.id;
                    conn.query('select replier.id,user.username,replier.create_time,replier.content from replier,user where replier.comment_id=' + commentId + " and replier.replier_id=user.id", function(err, list) {
                        buildResult(rows, list, commentId);
                        if(index == rows.length - 1) {
                            callback({
                                list: rows,
                                thumUpCount: thumUpCount
                            });
                        }
                    });
                });
            });
        });
    }
}
exports.comment = comment;