var fs = require("fs");
var md5 = require("../../public/common/md5");
exports.combineAssetsAction = function(req, res) {
    var params = req.param("params");
    function setFileModifyTime(headers) {
        if(typeof params != "string") {
            params = params.join(",");
        }
        fs.stat("routes/cache/" + md5(params) + ".js", function(err, stat) {
            var lastModified = stat.mtime.toUTCString();
            headers["Last-Modified"] = lastModified;
            var isModifiedSince = "If-Modified-Since".toLowerCase();
            if(req.headers[isModifiedSince] && lastModified == req.headers[isModifiedSince]) {
                res.writeHead(304, "Not Modified");
                res.end();
            } else {
                fs.readFile("routes/cache/" + md5(params) + ".js", function(error, data) {
                    res.writeHead(200, "Ok", {
                        "Last-Modified":  lastModified
                    });
                    res.end(data.toString());
                });
            }
        });
    }
    function setCacheHeader() {
        var headers = {
            "Content-Type": "text/javascript",
            "Cache-Control": "public"
        }
        setFileModifyTime(headers);
    }
    function sendConbineData(params, res) {
        params = params.split(",");
        function getSigleContent(index, params, jsContent) {
            if(index == params.length) {
                if(isUseGlobalCache) {
                    return fs.writeFile("routes/cache/" + md5(params.join(",")) + ".js", jsContent, function () {
                        setCacheHeader();
                    });
                } else {
                    return res.end(jsContent);
                }
            }
            var path = "public/" + params[index];
            fs.readFile(path, function(error, jsText) {
                if(error) {
                    jsContent += "\n";
                } else {
                    jsContent += jsText.toString() + "\n";
                }
                index++;
                return getSigleContent(index, params, jsContent);
            });
        }
        return getSigleContent(0, params, "");
    }
    if(params) {
        fs.exists("routes/cache/" + md5(params) + ".js", function(exists) {
            if(!exists) {
                sendConbineData(params, res);
            } else {
                setCacheHeader();
            }
        });
    }
}