var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.movie = function(req, res) {
    use(["public/pages/movie/store.js", "public/pages/movie/movie.js", "public/pages/movie/movieService.js"], function(store, app, movieService) {
        var storage = {
            typeList: [
                "easyspa",
                "easyme",
                "easyvue",
                "其他"
            ],
            defaultName: "easyvue",
            isCanNotClicked: false
        };//前后端共享数据
        var state = {};//所有组件共享数据
        renderEngin.call(res, 'movie', app, storage, state, store);
    }, "movie");
}