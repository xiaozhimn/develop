var tools = require("../common/tools").tools;
var menuService = require("../biz/menuService").menuService;
exports.getArticalMenuItems = function(req, res) {
    var params = req.params;
    menuService.selectArticalMenuItem(params, function(result) {
        res.json(result);
    });
}