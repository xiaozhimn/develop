var fs = require("fs");
var async = require("async");
var componentsPool = {};//组件缓存
exports.componentsAction = function(req, res) {
    var minifyDir = "minify";
    var url = req.url;
    url = url.indexOf("?") > -1 ? url.substring(0, url.indexOf("?")) : url;
    var htmlPath = "public" + replaceAll(url, ".js", ".html");
    var jsPath = "public" + url;
    var cssPath = "public" + replaceAll(url, ".js", ".css");
    if(isUseGlobalCache) {
        var headPath = jsPath.substring(0, jsPath.lastIndexOf("/"));
        var footPath = jsPath.substring(jsPath.lastIndexOf("/"), jsPath.length);
        jsPath = headPath + "/" + minifyDir + footPath;
        var headPath = cssPath.substring(0, cssPath.lastIndexOf("/"));
        var footPath = cssPath.substring(cssPath.lastIndexOf("/"), cssPath.length);
        cssPath = headPath + "/" + minifyDir + footPath;
    }
    function getHtmlData(done) {
        fs.readFile(htmlPath, function(error, htmlData) {
            if(htmlData) {
                done(null, htmlData.toString());
            } else {
                done(null, "");
            }
        });
    }
    function getJsData(done) {
        fs.readFile(jsPath, function(error, jsData) {
            if(jsData) {
                done(null, jsData.toString());
            } else {
                done(null, "");
            }
        });
    }
    function getCssData(done) {
        fs.readFile(cssPath, function(error, cssData) {
            if(cssData) {
                done(null, cssData.toString());
            } else {
                done(null, "");
            }
        });
    }
    if(!componentsPool[url]) {
        async.parallel({
            HtmlData: getHtmlData,
            jsData: getJsData,
            cssData: getCssData
        }, function (err, result) {
            less.render(result.cssData, function (e, cssText) {
                result.cssData = cssText.css;
            });
            componentsPool[url] = result;
            res.end(JSON.stringify(result));
        });
    } else {
        res.end(JSON.stringify(componentsPool[url]));
    }
}