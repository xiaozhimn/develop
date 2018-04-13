var tools = require("../common/tools").tools;
var menuService = require("../biz/menuService").menuService;
exports.getTop10ArticalList = function(req, res) {
    var params = req.params;
    menuService.getTop10ArticalList(params, function(result) {
        res.json(result);
    });
}