use([
    "public/pages/userinfo/store.js",
    "public/pages/userinfo/userinfoService.js"
], function() {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/userinfo/userinfo.html',
            data: {
                storage: storage
            },
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
