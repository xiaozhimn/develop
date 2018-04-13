var fs = require("fs");
var ejs = require("ejs");
var stream = require('stream');
var extend = require('node.extend');
function combineStore(store, state) {
    if(store.state && state) {
        store.state = extend(true, store.state, state);
        return store;
    } else if(!store.state && state) {
        store.state = {};
        store.state = extend(true, store.state, state);
        return store;
    } else if(store.state && !state) {
        return store;
    } else {
        store.state = {};
        return store;
    }
}
var renderEngin = function(pageName, Com, storage, store) {
    store = combineStore(store, storage.state);
    initComponets(pageName, store.state);
    var res = this;
    var minifyDir = "";
    for(var key in globalConfig) {
        storage[key] = globalConfig[key]
    }
    if(isUseGlobalCache) {
        minifyDir = "/minify";
    }
    function render(buffer) {
        var bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream.on('data', function(chunk) {
            if(!res.write(chunk)){
                bufferStream.pause();
            }
        });
        bufferStream.on('end', function () {
            res.end();
        });
        res.on("drain", function () {
            bufferStream.resume();
        });
    }
    fs.readFile("public/pages/" + pageName + "/" + pageName + ".html", function(error, data) {
        pageContent = data.toString();
        if(!isServerRender) {
            var prevHtml = pageContent.substring(0, pageContent.indexOf("<template>"));
            var nextHtml = pageContent.substring(pageContent.indexOf("</template>") + "</template>".length, pageContent.length);
            pageContent = prevHtml + "<div id='app'></div>" + nextHtml;
            if(storage) {
                storage["useCount"] = useCount[pageName];
            }
            storage = storage ? "<script>window.storage=" + JSON.stringify(storage) + "</script>" : '<script>window.storage={"useCount":"'+ useCount[pageName] +'"}</script>';
            var buffer = ejs.render(pageContent, {storage: storage, pageName: pageName, minifyDir:minifyDir, timestamp:timestamp, filename:"public/pages/common/header.html"});
            render(buffer);
        } else {
            if(storage) {
                storage["useCount"] = useCount[pageName];
            }
            Com = Com(storage, store);
            renderer.renderToString(Com, function (error, html) {
                if (error) throw error
                var prevHtml = pageContent.substring(0, pageContent.indexOf("<template>"));
                var nextHtml = pageContent.substring(pageContent.indexOf("</template>") + "</template>".length, pageContent.length);
                var scriptHtml = "";
                var pageTitle = storage["pageTitle"];
                pageContent = prevHtml + "<div id='app'>" + html + "</div>" + scriptHtml + nextHtml;
                storage = storage ? "<script>window.storage=" + JSON.stringify(storage) + "</script>" : '<script>window.storage={"useCount":"'+ useCount[pageName] +'"}</script>';
                var buffer = ejs.render(pageContent, {storage: storage, pageName: pageName, title:pageTitle, minifyDir:minifyDir, timestamp:timestamp, filename:"public/pages/common/header.html"});
                render(buffer);
            });
        }
    });
}
module.exports = renderEngin;