use([
    "public/pages/team/store.js",
    "public/pages/team/teamService.js",
    "public/pages/components/common/slider/slider.js"
], function() {
    function init(storage, store, sliderCompontent) {
        var app = new VueRoot({
            template: 'public/pages/team/team.html',
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
