var tools = require("../common/tools").tools;
var tplService = require("../biz/tplService").tplService;
exports.deleteTpl = function(req, res) {
    var params = req.params;
    params.userId = tools.getUserId(req);
    tplService.deleteTpl(params, function(result) {
        res.json(result);
    });
}