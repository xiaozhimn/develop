var fs = require("fs");
var cssPool = {};
exports.lessAction = function(req, res) {
    var path = "public/" + req.param("param");
    if(!cssPool[path]) {
        fs.readFile(path, function (err, data) {
            if (!isUseGlobalCache) {
                less.render(data.toString(), function (e, cssText) {
                    if(cssText) {
                        cssText = cssText.css;
                    } else {
                        cssText = "";
                    }
                    cssPool[path] = cssText;
                    res.end(cssText);
                });
            } else {
                cssPool[path] = data.toString();
                res.end(data.toString());
            }
        });
    } else {
        res.end(cssPool[path]);
    }
}