var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.movieList = function(req, res) {
    use(["public/pages/movieList/store.js", "public/pages/movieList/movieList.js", "public/pages/movieList/movieListService.js"], function(store, app, movieListService) {
        var storage = {};//前后端共享数据
        var state = {};//所有组件共享数据
        movieListService.getMovieList({
            headers: req.headers
        }, function(result) {
            storage["movieList"] = result.data;
            renderEngin.call(res, 'movieList', app, storage, state, store);
        });
    }, "movieList");
}