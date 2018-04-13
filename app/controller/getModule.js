var tools = require("../common/tools").tools;
var menuService = require("../biz/menuService").menuService;
exports.getModule = function(req, res) {
    var params = req.params;
    menuService.getModule(params, function(result) {
        res.json(result);
    });
}