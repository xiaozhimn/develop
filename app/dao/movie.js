var db = require("../common/connect");
var tools = require("../common/tools").tools;
var fs = require("fs");
var ffmpeg = require('fluent-ffmpeg');
var movie = {
    publish: function(params, callback) {
        var conn = db.connect();
        var userId = params.userId;
        var name = params.name;
        var desc = params.desc;
        var type = params.type;
        var tmpPath = params.tmpPath;
        var targetPath = params.targetPath;
        var url = params.url;
        var vedioPic = new Date().getTime() + ".png";
        new ffmpeg(tmpPath).screenshots({
            timemarks: ['0.5'],
            count: 1,
            filename: vedioPic,
            folder: 'public/file',
            size: '320x240'
        }).on('end', function() {
            fs.rename(tmpPath, targetPath, function(err) {
                fs.unlink(tmpPath, function() {
                    conn.query('select status from user where id=' + userId, function(err, rows) {
                        if(err) {
                            callback(false);
                        } else {
                            if(rows[0].status == 1) {
                                conn.query('insert into movie(name,userId,type,url,sourceDesc,pic) values("'+name+'","'+userId+'","'+type+'","'+url+'","'+desc+'", "'+vedioPic+'")', function(err) {
                                    if(err) {
                                        callback(false);
                                    } else {
                                        callback({
                                            picUrl: vedioPic
                                        });
                                    }
                                });
                            } else {
                                callback(false);
                            }
                        }
                    });
                });
            });
        }).on('error', function(err, stdout, stderr) {
            callback(false);
        })
    },
    queryMovieList: function(params, callback) {
        var listSize = params.size;
        var userId = params.userId;
        if(!listSize) {
            listSize = 1000;
        }
        var conn = db.connect();
        conn.query('select * from movie where userId=' + userId + " order by update_time desc limit 0," + listSize, function(err, rows) {
            if(err) {
                callback(false);
            } else {
                callback(rows);
            }
        });
    },
    deleteMovie: function(params, callback) {
        var userId = params.userId;
        var id = params.id;
        var conn = db.connect();
        conn.query('select status from user where id=' + userId, function(err, rows) {
            if(err) {
                callback(false);
            } else {
                if(rows[0].status == 1) {
                    conn.query("delete from movie where id=" + id + " and userId=" + userId, function(err) {
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
    getNewMovieList: function(callback) {
        var conn = db.connect();
        conn.query("select * from movie limit 0, 10", function(err, rows) {
            if(err) {
                callback(false);
            } else {
                callback(rows);
            }
        });
    }
}
exports.movie = movie;