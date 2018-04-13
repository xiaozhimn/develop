var tools = require("../common/tools").tools;
var tplService = require("../biz/tplService").tplService;
exports.publishTpl = function(req, res) {
    var params = req.params;
    params.userId = tools.getUserId(req);
    tplService.publish(params, function(result) {
        res.json(result);
    });
}