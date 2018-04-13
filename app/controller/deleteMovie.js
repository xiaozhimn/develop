var tools = require("../common/tools").tools;
var movieService = require("../biz/movieService").movieService;
exports.deleteMovie = function(req, res) {
    var params = req.params;
    params.userId = tools.getUserId(req);
    movieService.deleteMovie(params, function(result) {
        res.json(result);
    });
}