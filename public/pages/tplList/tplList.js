use([
    "public/pages/tplList/store.js",
    "public/pages/tplList/tplListService.js"
], function() {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/tplList/tplList.html',
            data: storage,
            store: store,
            created: function() {},
            mounted: function() {
                $("#tpl-iframe").height(600);
                if(typeof window != "undefined") {
                    window.setIframeHeight = function(height) {
                        $("#tpl-iframe").height(height);
                    }
                }
            },
            methods: {
                showTpl: function(id) {
                    tplListService.getTplSigleContent({
                        urlParams: {
                            id: id
                        }
                    }, function(result) {
                        $("#tpl-iframe")[0].contentWindow.renderTpl(result.name, result.content);
                    })
                }
            }
        });
        return app;
    }
    module.exports = init;
    if(typeof window != "undefined") {
        var mainComponent = init(storage, store);
        mainComponent.$mount("#app");
    }
});
