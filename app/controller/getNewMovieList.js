var tools = require("../common/tools").tools;
var movieService = require("../biz/movieService").movieService;
exports.getNewMovieList = function(req, res) {
    movieService.getNewMovieList(function(result) {
        res.json(result);
    });
}