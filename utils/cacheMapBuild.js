var md5 = require("md5");
var fs = require("fs");
var cacheMapTools = {
    cacheMapConfig: JSON.parse(fs.readFileSync("./cacheMap.js").toString()),
    componentsDir: "public/pages/components",
    widget: "public/widget",
    buildComponentsDir: function(componentsDir) {
        var self = this;
        var files = fs.readdirSync(componentsDir);
        files.forEach(function(file) {
            var stats = fs.statSync(componentsDir + "/" + file);
            if(stats.isDirectory() && file != "minify") {
                self.buildComponentsDir(componentsDir + "/" + file);
            } else {
                if(stats.isDirectory() && file == "minify") {
                    //buildComponentsMd5();
                }
            }
        });
    },
    build: function() {
        this.clear();
        this.buildComponentsDir(this.componentsDir);
    },
    updateCacheMap: function(json) {
        var cacheStr = JSON.stringify(json, null, 4);
        fs.writeFileSync("./cacheMap.js", cacheStr);
    },
    clear: function() {
        var cacheJson = this.cacheMapConfig;
        for(var key in cacheJson) {
            cacheJson[key] = {};
        }
        fs.writeFileSync("./cacheMap.js", JSON.stringify(cacheJson, null, 4));
    }
}
module.exports = cacheMapTools;