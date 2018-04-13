var tools = require("../common/tools").tools;
var commentService = require("../biz/commentService").commentService;
exports.thumbUpForArtical = function(req, res) {
    var params = req.params;
    params.userId = tools.getUserId(req);
    commentService.thumbUp(params, function(result) {
        res.json(result);
    });
}