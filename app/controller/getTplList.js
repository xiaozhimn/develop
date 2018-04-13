var tools = require("../common/tools").tools;
var tplService = require("../biz/tplService").tplService;
exports.getTplList = function(req, res) {
    tplService.getTplList(function(result) {
        res.json(result);
    });
}