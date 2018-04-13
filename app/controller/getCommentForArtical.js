var tools = require("../common/tools").tools;
var commentService = require("../biz/commentService").commentService;
exports.getCommentForArtical = function(req, res) {
    var articalId = req.param("articalId");
    var params = req.params;
    commentService.getCommentForArtical(params, function(result) {
        res.json(result);
    });
}