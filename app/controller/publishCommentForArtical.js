var tools = require("../common/tools").tools;
var commentService = require("../biz/commentService").commentService;
exports.publishCommentForArtical = function(req, res) {
    var articalId = req.param("articalId");
    var params = req.params;
    params.userId = tools.getUserId(req);
    commentService.publishCommentForAtical(params, function(result) {
        res.json(result);
    });
}