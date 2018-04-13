var db = require("../common/connect");
var tools = require("../common/tools").tools;
var fs = require("fs");
var tpl = {
    add: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var name = params.name;
        var content = params.content;
        var tplId = params.tplId;
        conn.query('select status from user where id=' + userId, function(err, rows) {
            if(err) {
                callback(false);
            } else {
                if(rows[0].status == 1) {
                    if(!tplId) {
                        conn.query('insert into tpl(name,user_id,content) values("' + name + '",' + userId + ',"' + content + '")', function (err) {
                            if (err) {
                                callback(false);
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        conn.query('update tpl set name="' + name + '",user_id=' + userId + ',content="' + content + '" where id=' + tplId, function (err) {
                            if (err) {
                                callback(false);
                            } else {
                                callback(true);
                            }
                        });
                    }
                } else {
                    callback(false);
                }
            }
        });
    },
    queryTplList: function(callback) {
        var conn = db.connect();
        conn.query("select id,name from tpl", function(err, rows) {
            callback(rows);
        });
    },
    queryTplSigleContent: function(params, callback) {
        var conn = db.connect();
        var id = params.id;
        conn.query("select id,name,content from tpl where id=" + id, function(err, rows) {
            if(!err) {
                callback({
                    name: rows[0].name,
                    content: decodeURIComponent(rows[0].content)
                });
            } else {
                callback({});
            }
        });
    },
    deleteTpl: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var id = params.id;
        if(!id) {
            id=-1;
        }
        conn.query('select status from user where id=' + userId, function(err, rows) {
            if(err) {
                callback(false);
            } else {
                if(rows[0].status == 1) {
                    conn.query("delete from tpl where id=" + id, function (err, rows) {
                        if (!err) {
                            callback(true)
                        } else {
                            callback(false);
                        }
                    });
                } else {
                    callback(false);
                }
            }
        });
    },
    saveStyleContent: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var styleContent = params.styleContent;
        conn.query('select status from user where id=' + userId, function(err, rows) {
            if(err) {
                callback(false);
            } else {
                if(rows[0].status == 1) {//对文件进行操作
                    fs.writeFile("public/lib/easyvue.css", styleContent, function(err) {
                         if(err) {
                             callback(false);
                         } else {
                             callback(true);
                         }
                    });
                } else {
                    callback(false);
                }
            }
        });
    },
    getStyleContent: function(callback) {
        fs.readFile("public/lib/easyvue.css", function(err, result) {
            if(err) {
                callback(false);
            } else {
                callback(result.toString());
            }
        });
    }
}
exports.tpl = tpl;