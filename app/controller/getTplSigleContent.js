var tools = require("../common/tools").tools;
var tplService = require("../biz/tplService").tplService;
exports.getTplSigleContent = function(req, res) {
    var params = req.params;
    tplService.getTplSigleContent(params, function(result) {
        res.json(result);
    });
}