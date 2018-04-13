use([
    "public/pages/index/store.js",
    "public/pages/index/indexService.js"
], function() {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/index/index.html',
            data: storage,
            store: store,
            created: function() {},
            mounted: function() {

            },
            methods: {

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
