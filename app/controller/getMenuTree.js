var tools = require("../common/tools").tools;
var menuService = require("../biz/menuService").menuService;
exports.getMenuTree = function(req, res) {
    var params = req.params;
    menuService.getMenuTree(params, function(result) {
        res.json(result);
    });
}