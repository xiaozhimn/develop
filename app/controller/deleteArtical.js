var tools = require("../common/tools").tools;
var articalService = require("../biz/articalService").articalService;
exports.deleteArtical = function(req, res) {
    var articalId = req.param("articalId");
    var params = req.params;
    params.userId = tools.getUserId(req);
    articalService.deleteArtical(params, function(result) {
        res.json(result);
    });
}