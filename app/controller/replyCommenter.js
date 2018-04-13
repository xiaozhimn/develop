var tools = require("../common/tools").tools;
var commentService = require("../biz/commentService").commentService;
exports.replyCommenter = function(req, res) {
    var params = req.params;
    params.userId = tools.getUserId(req);
    commentService.replyCommenter(params, function(result) {
        res.json(result);
    });
}