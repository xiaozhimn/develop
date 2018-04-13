var compression = require('compression');
var express = require("express");
var path = pathTool = require("path");
var app = express();
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('../swagger.json');
var ejs = require('ejs');
var fs = require("fs");
var NodeCache = require("node-cache");
var pageTocommonComponent = {};
var commonComponentPool = {};
var UglifyJS = require("uglify-js");
global.less = require('less');
global.useCount = {};
global.Vue = require('vue');
global.stores = {};
global.components = {};
global.renderer = require('vue-server-renderer').createRenderer();
global.cache = new NodeCache();
global.globalConfig = JSON.parse(fs.readFileSync("config.json"));
global.isUseGlobalCache = globalConfig.isUseGlobalCache;
global.timestamp = globalConfig.timestamp;
global.isServerRender = globalConfig.isServerRender;
global.Api = require("../routes/common/api");
global.cacheMapTools = require("./cacheMapBuild");
var classPool = {};
var child_process = require('child_process');
cacheMapTools.build();
if(!isUseGlobalCache) {
    timestamp = new Date().getTime();
    var globalConfigJson = JSON.parse(fs.readFileSync("config.json"));
    globalConfigJson.timestamp = timestamp;
    fs.writeFileSync("config.json", JSON.stringify(globalConfigJson, null, 4));
}
String.prototype.trim=function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
function execCmd(cmd, callback) {
    child_process.exec(cmd, function (error, stdout, stderr) {
        if(callback) {
            callback();
        }
    });
}
global.replaceAll = function(str, s1,s2) {
    if(str) {
        return str.replace(new RegExp(s1, "gm"), s2);
    } else {
        return "";
    }
}
/**
 * 从缓存中移除module
 */
function purgeCache(moduleName) {
    // 遍历缓存来找到通过指定模块名载入的文件
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // 删除模块缓存的路径
    // 多谢@bentael指出这点
    Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
        if (cacheKey.indexOf(moduleName)>0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
};

/**
 * 遍历缓存来查找通过特定模块名缓存下的模块
 */
function searchCache(moduleName, callback) {
    //  通过指定的名字resolve模块
    var mod = require.resolve(moduleName);

    // 检查该模块在缓存中是否被resolved并且被发现
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // 递归的检查结果
        (function traverse(mod) {
            // 检查该模块的子模块并遍历它们
            mod.children.forEach(function (child) {
                traverse(child);
            });

            // 调用指定的callback方法，并将缓存的module当做参数传入
            callback(mod);
        }(mod));
    }
};
execCmd("rm -rf routes/cache/*");
var config = function() {
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
    app.use(express.bodyParser());
}
function getClientIp(req) {
    var clientIp = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    if(clientIp.indexOf("f:") > -1) {
        return clientIp.split("f:")[1];
    } else {
        return clientIp;
    }
}
var configStyle = function() {
    var dirname = __dirname;
    dirname = dirname.substring(0, dirname.lastIndexOf("\\"));
    app.use(compression()); //use compression
    // var options = {
    //     extensions: ['png','gif','jpg','svg'],
    //     index: true,
    //     maxAge: '3600000',
    //     etag: false,
    //     redirect: true,
    //     setHeaders: function (res, path, stat) {
    //         res.set('x-timestamp', Date.now())
    //     }
    // };
    app.use(express.json({limit: '100mb'}));
    app.use(express.urlencoded({limit: '100mb'}));
    app.use(express.static(path.join(dirname, 'public')));
    app.use(express.static(path.join(dirname, 'node_modules/swagger-ui-express/static')));
    app.get('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.watch = function(port) {
    var watchString = fs.readFileSync("./routes/watch.json").toString();
    var watchJson = JSON.parse(watchString);
    var requestList = watchJson.request;
    global.routeList = requestList;
    for(var index = 0; index < requestList.length; index++) {
        var page = require(requestList[index].url);
        var requestName = requestList[index].requestName;
        var routeAction = page[requestName];
        (function(routeAction, requestName, requestList, index, page) {
            page[requestName] = function(req, res) {//拦截请求
                req.params = Object.assign(req.body, req.query);
                var addVisitor = require("../app/controller/addVisitor").watcher;
                addVisitor(req, res, function() {
                    routeAction.call(this, req, res);
                });
            }
            app[requestList[index].type](requestList[index].route, page[requestName]);
        })(routeAction, requestName, requestList, index, page);
    }
    configStyle();
    app.listen(port);
}
function getTemplateContent(html) {
    var startMark = "<template>";
    var endMark = "</template>";
    var startPos = html.indexOf(startMark);
    var endPos = html.indexOf(endMark);
    html = html.substring(startPos + startMark.length, endPos).trim();
    return html;
}
global.VueComponent = Vue.component;
global.initComponets = function(pageName, state) {
    var thisPageUsedCommonComponents = pageTocommonComponent[pageName];
    if(!components[pageName]) {
        return;
    }
    for(i = 0; i < thisPageUsedCommonComponents.length; i++) {
        components[pageName].push(commonComponentPool[thisPageUsedCommonComponents[i]]);
    }
    for(var index = 0; index < components[pageName].length; index++) {
        var args = components[pageName][index]["params"];
        var context = components[pageName][index]["context"];
        var dataFunc = components[pageName][index]["data"];
        for(var k = 0; k < args.length; k++) {
            var config = args[k];
            if(typeof config == "object") {
                config.data = function() {
                    var data = {};
                    if(dataFunc) {
                        data = dataFunc();
                    }
                    for (var key in state) {
                        data[key] = state[key];
                    }
                    return data;
                }
                args[k] = config;
            }
        }
        VueComponent.apply(context, args);
    }
}
global.VueRoot = function() {
    var store = {};
    var args = arguments;
    for(var index = 0; index < args.length; index++) {
        var config = args[index];
        if(typeof config == "object" && config.store && config.store.state) {
            store = config.store;
            var data = {};
            if (config.data) {
                data = config.data;
            }
            if (store.state) {
                for (var key in store.state) {
                    data[key] = store.state[key];
                }
            }
            config.data = function () {
                return data;
            }
        }
        if(typeof config == "object" && config.template && config.template.indexOf("public/") > -1) {
             var template = fs.readFileSync(config.template).toString();
             args[index].template = getTemplateContent(template);
        }
    }
    var v = new Vue(args[0]);
    return v;
}
Vue.component = function() {
    var self = this;
    var args = arguments;
    for(var index = 0; index < args.length; index++) {
        var config = args[index];
        (function(config, index) {
            if(typeof config == "object" && config.template && config.template.indexOf("public/") > -1) {
                var templateUrl = config.template;
                var templateCssPath = replaceAll(config.template, ".html", ".css");
                var pageName = config.pageName;
                var dataFunc = config.data;
                config.template = fs.readFileSync(config.template).toString();
                var cssText = fs.readFileSync(templateCssPath).toString();
                less.render(cssText, function (e, cssContent) {
                    cssText = cssContent.css;
                });
                config.template = "<div><style>" + cssText + "</style>" + config.template + "</div>";
                args[index] = config;
                if(!pageName) {
                    VueComponent.apply(self, args);
                } else {
                    if(templateUrl.indexOf("/components/common/") == -1) {
                        if (!components[pageName]) {
                            components[pageName] = [];
                        }
                        components[pageName].push({
                            "context": self,
                            "params": args,
                            "data": dataFunc
                        });
                    } else {
                        commonComponentPool[templateUrl.substring(templateUrl.lastIndexOf("/") + 1, templateUrl.lastIndexOf("."))] = {
                            "context": self,
                            "params": args,
                            "data": dataFunc
                        }
                    }

                }
            } else if(typeof config == "object" && config.template && config.template.indexOf("public/") == -1) {
                var pageName = config.pageName;
                var dataFunc = config.data;
                if(!pageName) {
                    VueComponent.apply(self, args);
                } else {
                    if(!components[pageName]) {
                        components[pageName] = [];
                    }
                    components[pageName].push({
                        "context": self,
                        "params": args,
                        "data": dataFunc
                    });
                }
            }
        })(config, index);
    }
}
var useNum = 0;//每个页面分析use次数计数
var currentPageName = "";
global.use = function(pathArray, callback, pageName) {
    if(pageName) {
        if(!pageTocommonComponent[pageName]) {
            pageTocommonComponent[pageName] = [];
        }
        currentPageName = pageName;
    }
    var classArray = [];
    for(var index = 0; index < pathArray.length; index++) {
        var path = pathArray[index];
        purgeCache("../" + pathArray[index]);
        var classObj = require("../" + pathArray[index]);
        if(pathArray[index].indexOf("/store.js") > -1) {
            stores[pageName] = classObj;
        }
        if(pathArray[index].indexOf("/components/common/") > -1) {
            var flag = false;
            for(var i = 0; i < pageTocommonComponent[currentPageName].length; i++) {
                if(pageTocommonComponent[currentPageName][i] == pathArray[index]) {
                    flag = true;
                    break;
                }
            }
            if(!flag) {
                pageTocommonComponent[currentPageName].push(pathArray[index].substring(pathArray[index].lastIndexOf("/") + 1, pathArray[index].lastIndexOf(".")));
            }
        }
        classPool[path] = classObj;
        classArray.push(classObj);
    }
    if(pageName) {
        useCount[pageName] = useNum;
        useNum = 0;
    } else if(!pageName) {
        useNum++;

    }
    callback.apply(null, classArray);
}
var conf = {
    init: function() {
        config();
        return {
            path:path,
            ejs: ejs,
            app:app
        }
    }
}
exports.conf = conf;
