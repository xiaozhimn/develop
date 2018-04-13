var tools = require("../common/tools").tools;
var movieService = require("../biz/movieService").movieService;
exports.getMovieList = function(req, res) {
    var params = req.params;
    params.userId = tools.getUserId(req);
    movieService.getMovieList(params, function(result) {
        res.json(result);
    });
}