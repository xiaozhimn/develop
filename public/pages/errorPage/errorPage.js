use([
    "public/pages/errorPage/store.js",
    "public/pages/errorPage/errorPageService.js"
], function() {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/errorPage/errorPage.html',
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
