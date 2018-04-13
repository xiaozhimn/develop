var tools = require("../common/tools").tools;
var articalService = require("../biz/articalService").articalService;
exports.searchUserSelfPublishedArtical = function(req, res) {
    var params = req.params;
    params.userId = tools.getUserId(req);
    articalService.searchUserSelfPublishedArtical(params, function(result) {
        res.json(result);
    });
}