var db = require("../common/connect");
var tools = require("../common/tools").tools;
var artical = {
    add: function(params, callback) {
        var conn = db.connect();
        var platFormId = params.platFormId;
        var name = params.name;
        var desc = params.desc;
        var content = encodeURIComponent(params.content);
        var userId = params.userId;
        conn.query('select status from user where id=' + userId, function(err, rows) {
            if(err) {
                callback(false);
            } else {
                if(rows[0].status == 1) {
                    conn.query('insert into artical(plat_id,name,artical_desc,content,publisher_id) values(' + platFormId + ',"' + name + '","' + desc +'","' + content + '",' + userId + ')', function(err) {
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
    update: function(params, callback) {
        var conn = db.connect();
        var platFormId = params.platFormId;
        var name = params.name;
        var desc = params.desc;
        var content = encodeURIComponent(params.content);
        var userId = params.userId;
        var articalId = params.articalId
        conn.query('select id from artical where id=' + articalId, function(err, rows) {
            if(rows.length == 0) {
                callback(false);
                return;
            }
            conn.query('update artical set plat_id='+ platFormId + ',name="' + name + '",artical_desc="' + desc + '",content="' + content + '" where id=' + articalId + ' and publisher_id=' + userId, function(err) {
                if(err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        });
    },
    delete: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var articalId = params.articalId;
        conn.query('delete from artical where id=' + articalId + " and publisher_id=" + userId, function(err) {
            if(err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    },
    selectOne: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var articalId = params.articalId;
        conn.query('select menu.parentId as plat_id,artical.plat_id as module_id,artical.name,artical.artical_desc,artical.content,user.username as publisher,artical.update_time,artical.read_count from artical,user,menu where artical.id=' + articalId + " and menu.id=artical.plat_id and user.id=artical.publisher_id", function(err, rows) {
            if(err) {
                callback(false);
            } else {
                if(rows.length > 0) {
                    if(rows[0].plat_id == 0) {
                        rows[0].plat_id = rows[0].module_id;
                        rows[0].module_id = 0;
                        rows[0].content = rows[0].content;
                    }
                }
                callback(rows[0]);
            }
        });
    },
    selectArticals: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var currentPage = params.currentPage;
        var pageSize = params.pageSize;
        conn.query('select count(id) as total from artical where publisher_id=' + userId, function(err, rows) {
            if(err) {
                callback(false);
                return;
            }
            var total = rows.length > 0 ? rows[0].total : 0;
            if(!total) {
                total = 0;
            }
            conn.query('select artical.id,artical.plat_id,menu.name as menuName,artical.name,artical.artical_desc,artical.update_time,artical.read_count from artical,menu where publisher_id=' + userId + " and menu.id=artical.plat_id order by update_time desc limit " + pageSize * (currentPage - 1) + "," + pageSize, function(err, rows) {
                if(err) {
                    callback(false);
                } else {
                    callback({
                        list: rows,
                        totalCount: total,
                        currentPage: currentPage,
                        pageSize: pageSize
                    });
                }
            });
        });
    },
    queryArticalByPlatFormIdOrKeyWord: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var currentPage = params.currentPage;
        var pageSize = params.pageSize;
        var keyWord = params.keyWord || "";
        var platFormId = params.platFormId;
        var condition = "";
        if(platFormId) {//所有的
            condition = " and plat_id=" + platFormId;
        }
        conn.query('select count(id) as total from artical where publisher_id=' + userId + condition + ' and name like "%' + keyWord + '%"', function(err, rows) {
            if(err) {
                callback(false);
                return;
            }
            var total = rows.length > 0 ? rows[0].total : 0;
            condition += " and user.id=" + userId;
            conn.query('select artical.id,menu.name as menuName,artical.plat_id,artical.name,artical.artical_desc,artical.content,artical.publisher_id,artical.read_count,user.username as publisher from artical,user,menu where publisher_id=' + userId + condition + ' and artical.name like "%' + keyWord + '%"' + " and menu.id=artical.plat_id order by artical.update_time desc limit " + pageSize * (currentPage - 1) + "," + pageSize, function(err, rows) {
                if(err) {
                    callback(false);
                } else {
                    callback({
                        list: rows,
                        totalCount: total,
                        currentPage: currentPage,
                        pageSize: pageSize
                    });
                }
            });
        });
    },
    getPrevAndNextArticalId: function(params, callback) {
        var conn = db.connect();
        var articalId = params.articalId;
        var preArticalId;
        var nextArticalId;
        var preArticalPlatId;
        var nextArticalPlatId;
        conn.query("select id,plat_id from artical where id<" + articalId + " order by id desc limit 0,1", function(err, rows) {
            if(err) {
                callback(false);
            } else {
                preArticalId = rows[0] ? rows[0].id : -1;
                preArticalPlatId = rows[0] ? rows[0].plat_id : -1;
                conn.query("select id,plat_id from artical where id>" + articalId + " order by id limit 0,1", function(err, rows) {
                    if(err) {
                        callback(false);
                    } else {
                        nextArticalId = rows[0] ? rows[0].id : -1;
                        nextArticalPlatId = rows[0] ? rows[0].plat_id : -1;
                        callback({
                            preArtical: {
                                id: preArticalId,
                                platId: preArticalPlatId
                            },
                            nextArtical: {
                                id: nextArticalId,
                                platId: nextArticalPlatId
                            }

                        });
                    }
                });
            }
        });
    }
}
exports.artical = artical;