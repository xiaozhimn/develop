use([
    "public/pages/movieList/store.js",
    "public/pages/movieList/movieListService.js",
    "public/pages/components/movieList/table/table.js"
], function() {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/movieList/movieList.html',
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
