use([
    "public/pages/docs/store.js",
    "public/pages/docs/docsService.js",
    "public/pages/components/docs/content/content.js",
    "public/pages/components/docs/comment/comment.js",
    "public/pages/components/common/slider/slider.js"
], function() {
    function init(storage, store, contentComponent, commentComponent, sliderCompontent) {
        var app = new VueRoot({
            template: 'public/pages/docs/docs.html',
            data: storage,
            store: store,
            computed: {
              hasPreArtical: function () {
                return this.preAndNextArtical.preArtical && this.preAndNextArtical.preArtical && this.preAndNextArtical.preArtical.id !== -1 ? true : false;
              },
              hasNextArtical: function () {
                return this.preAndNextArtical.nextArtical && this.preAndNextArtical.nextArtical && this.preAndNextArtical.nextArtical.id !== -1 ? true : false;
              },
            },
            created: function() {},
            mounted: function() {},
            methods: {}
        });
        return app;
    }
    module.exports = init;
    if(typeof window != "undefined") {
        var mainComponent = init(storage, store);
        mainComponent.$mount("#app");
    }
});
