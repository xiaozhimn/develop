var module = {};
var easyVue = {};
var componentPool = {};
var assetsPool = {};
var exceptionConfig;
easyVue.relateJs = {};//依赖js的存储容器
String.prototype.replaceAll  = function(s1,s2) {
    return this.replace(new RegExp(s1,"gm"),s2);
}
easyVue.getQueryString = function(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
easyVue.httpResponseInterceptor = function(res) {
    if(!exceptionConfig) {
        exceptionConfig = $.ajax({
            url: "common/exception.json",
            type: "GET",
            async: false
        }).responseText;
        exceptionConfig = JSON.parse(exceptionConfig);
    }
    for(var code in exceptionConfig) {
        if(res[code]) {
            for(var val in exceptionConfig[code]) {
                if(val == res[code]) {
                    var gotoUrl = exceptionConfig[code][val];
                    if(val != "401" && val != '403') {
                        location.href = gotoUrl;
                    } else if(val == "401") {
                        location.href = storage.loginRoute;
                    }
                    break;
                }
            }
        }
    }
    return res;
}
easyVue.getTplContent = function(url, callback) {
    if(callback) {
        $.ajax({
            url: url.substring(url.indexOf("/"), url.length),
            type: "GET",
            cache: storage.isUseGlobalCache,
            dataType: "text",
            success: function(data) {
                cacheStore.set(url, {
                    url: data,
                    timestamp: storage.timestamp
                });
                callback(data);
            }
        });
    } else {
        var content = $.ajax({
            url: url.substring(url.indexOf("/"), url.length),
            cache: storage.isUseGlobalCache,
            type: "GET",
            dataType: "text",
            async: false
        }).responseText;
        cacheStore.set(url, {
            url: content,
            timestamp: storage.timestamp
        });
        return content;
    }
}
easyVue.getRemoteTpl = function(url, callback) {
    var minifyDir = "minify";
    if(url.indexOf(".js") == (url.length - 3) && (url.indexOf("components/") == -1) && (url.indexOf("widget/") == -1) && storage.isUseGlobalCache) {
        var headPath = url.substring(0, url.lastIndexOf("/"));
        var footPath = url.substring(url.lastIndexOf("/"), url.length);
        url = headPath + "/" + minifyDir + footPath;
    }
    if(url.indexOf("?") > -1) {
        url += "&timestamp=" + storage.timestamp;
    } else {
        url += "?timestamp=" + storage.timestamp;
    }
    var localData = cacheStore.get(url);
    if(localData && localData.timestamp == storage.timestamp) {
        if(callback) {
            callback(localData.url);
        } else {
            return localData.url;
        }
    } else {
        return easyVue.getTplContent(url, callback);
    }
}
function getTemplateContent(html) {
    var startMark = "<template>";
    var endMark = "</template>";
    var startPos = html.indexOf(startMark);
    var endPos = html.indexOf(endMark);
    html = html.substring(startPos + startMark.length, endPos).trim();
    return html;
}
easyVue.async = {
    done: function(key, callback, result, taskCount) {
        return function(err, data) {
            var index = 0;
            result[key] = data;
            for(var item in result) {
                index++;
                if(index == taskCount) {
                    callback(null, result);
                }
            }
        }
    },
    parallel : function(config, callback) {
        var result = {};
        var taskCount = 0;
        for(var key in config) {
            taskCount++;
        }
        for(var key in config) {
            config[key](this.done(key, callback, result, taskCount));
        }
    }
}
function requireJs(path) {
    return function(done) {
        if(path && !assetsPool[path]) {
            assetsPool[path] = true;
            easyVue.getRemoteTpl(path, function (result) {
                done(null, result);
            });
        } else {
            done(null, "");
        }
    }
}
function combineStore(store, state) {
    if(store.state && state) {
        store.state = $.extend(true, store.state, state);
        return store;
    } else if(!store.state && state) {
        store.state = {};
        store.state = $.extend(true, store.state, state);
        return store;
    } else if(store.state && !state) {
        return store;
    } else {
        store.state = {};
        return store;
    }
}
var VueRoot = function() {
    store = combineStore(store, storage.state);
    var args = arguments;
    for(var index = 0; index < args.length; index++) {
        var config = args[index];
        if(typeof config == "object" && store.state) {
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
            var template = easyVue.getRemoteTpl(config.template);
            args[index].template = getTemplateContent(template);
        }
    }
    var v = new Vue(args[0]);
    v.actions = store.actions;
    v.state = store.state;
    flux.ev.push(v);
    return v;
}
var VueComponent = Vue.component;
Vue.component = function() {
    store = combineStore(store, storage.state);
    var self = this;
    var args = arguments;
    for(var index = 0; index < args.length; index++) {
        var config = args[index];
        (function(config, index) {
            if(typeof config == "object" && store.state) {
                var data = {};
                if(config.data) {
                    data = config.data();
                }
                if(store.state) {
                    for (var key in store.state) {
                        data[key] = store.state[key];
                    }
                }
                config.data = function() {
                    return data;
                }
            }
            if(typeof config == "object" && config.template && config.template.indexOf("public/") > -1) {
                config.template = componentPool[config.template];
                args[index] = config;
                VueComponent.apply(self, args);
            } else if(typeof config == "object" && config.template && config.template.indexOf("public/") == -1) {
                VueComponent.apply(self, args);
            }
        })(config, index);
    }
}
function insertJs(jsText, index, jsCount) {
    $.globalEval(jsText);
}
function insertCss(cssText) {
    var styleEle = $("<style></style>");
    styleEle.html(cssText);
    $("head").append(styleEle);
}
easyVue.useCount = 0;
var callbackPool = [];
window.use = function(jsArray, callback) {
    callbackPool.push(callback);
    var jsPool = {};
    if(!jsArray || jsArray.length == 0) {
        jsPool["null"] = requireJs("");
    } else {
        for(var index = 0; index < jsArray.length; index++) {
            jsPool[jsArray[index]] = requireJs(jsArray[index]);
        }
    }
    easyVue.async.parallel(jsPool, function(err, result) {
        var index = 0;
        for(key in result) {
            index++;
            if(!result[key]) {
                continue;
            }
            if(key.indexOf("/components/") > -1) {
                var componentObj = JSON.parse(result[key]);
                var html = componentObj.HtmlData;
                var js = componentObj.jsData;
                var componentName = key.substring(key.lastIndexOf("/") + 1, key.length - 3);
                if(js.indexOf("created") > -1) {
                    var headJs = js.substring(0, js.indexOf("{", js.indexOf("created")) + 1);
                    var footJs = js.substring(js.indexOf("{", js.indexOf("created")) + 1, js.length);
                    js = headJs + '\n\t\t\tflux.subscribe(this, "'+ componentName +'");\n' + footJs;
                }
                var css = componentObj.cssData;
                componentPool[key.replaceAll(".js", ".html")] = html;
                insertJs(js, index, jsArray.length);
                insertCss(css);
            } else if(key.indexOf("/widget") > -1) {
                var widgetObj = JSON.parse(result[key]);
                var html = widgetObj.HtmlData;
                var js = widgetObj.jsData;
                var css = widgetObj.cssData;
                html = html.replaceAll("'", '"');
                js = js.replaceAll("~html", html);
                insertJs(js, index, jsArray.length);
                insertCss(css);
            } else if(key.indexOf("/widget") == -1) {
                insertJs(result[key], index, jsArray.length);
            }
        }
        easyVue.useCount++;
        if(easyVue.useCount == storage["useCount"]) {
            for(var index = callbackPool.length - 1; index >=0; index--) {
                callbackPool[index]();
            }
            easyVue.useCount = 0;
            callbackPool = [];
        }
    });
}