var tools = require("../common/tools").tools;
var movieService = require("../biz/movieService").movieService;
exports.saveMovie = function(req, res) {
    var params = req.params;
    params.userId = tools.getUserId(req);
    var oldname = req.files["vedio"].name;
    if(!oldname) {
        res.json(tools.error("上传文件不能为空!"));
        return;
    }
    var tagetPath = "public/file/";
    var fileName = new Date().getTime() + "." + oldname.split(".")[1];
    params["tmpPath"] = req.files["vedio"].path;
    params["targetPath"] = tagetPath + fileName;
    params["url"] = "file/" + fileName;
    movieService.publish(params, function(result) {
        res.json(result);
    });
}