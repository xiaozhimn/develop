var tools = require("../common/tools").tools;
var movieDao = require("../dao/movie").movie;
var movieService = {
    publish: function(params, callback) {
        var userId = params.userId;
        var name = params.name;
        var desc = params.desc;
        var type = params.type;
        var id  =   params.id;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        if(!name || !desc || !type) {
            callback(tools.error("发布信息不能为空!"));
            return;
        }
        if(!id) {
            movieDao.publish(params, function (result) {
                if (result) {
                    callback(tools.success(result));
                } else {
                    callback(tools.error("您没有权限发布文章"));
                }
            });
        }
    },
    getMovieList: function(params, callback) {
        var userId = params.userId;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        movieDao.queryMovieList(params, function (result) {
            if (result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("获取数据失败!"));
            }
        });
    },
    deleteMovie: function(params, callback) {
        var userId = params.userId;
        if(!userId) {
            callback(tools.loginFirst());
            return;
        }
        movieDao.deleteMovie(params, function (result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("删除数据失败!"));
            }
        });
    },
    getNewMovieList: function(callback) {
        movieDao.getNewMovieList(function (result) {
            if(result) {
                callback(tools.success(result));
            } else {
                callback(tools.error("获取视频失败!"));
            }
        });
    }
}
exports.movieService = movieService;