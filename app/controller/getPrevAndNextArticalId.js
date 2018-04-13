var tools = require("../common/tools").tools;
var articalService = require("../biz/articalService").articalService;
exports.getPrevAndNextArticalId = function(req, res) {
    var params = req.params;
    articalService.getPrevAndNextArticalId(params, function(result) {
        res.json(result);
    });
}