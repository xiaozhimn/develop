var tools = require("../common/tools").tools;
var tplService = require("../biz/tplService").tplService;
exports.getStyleContent = function(req, res) {
    tplService.getStyleContent(function(result) {
        res.json(result);
    });
}