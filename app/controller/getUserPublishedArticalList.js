var tools = require("../common/tools").tools;
var articalService = require("../biz/articalService").articalService;
exports.getUserPublishedArticalList = function(req, res) {
    var params = req.params;
    params.userId = tools.getUserId(req);
    articalService.getUserPublishedArticalList(params, function(result) {
        res.json(result);
    });
}