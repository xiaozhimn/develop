var tools = require("../common/tools").tools;
var articalService = require("../biz/articalService").articalService;
exports.publishArtical = function(req, res) {
    var articalId = req.param("articalId");
    var params = req.params;
    params.userId = tools.getUserId(req);
    if(articalId || articalId == "") {//编辑
        params.articalId = articalId;
        articalService.editArtical(params, function(result) {
            res.json(result);
        });
    } else {//发布
        articalService.publish(params, function(result) {
            res.json(result);
        });
    }
}