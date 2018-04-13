use([
    "public/pages/tplView/store.js",
    "public/pages/tplView/tplViewService.js"
], function() {
    function init(storage, store) {
        if(typeof window != "undefined") {
            window.renderTpl = function(name, code) {
                $("#content-box").html(code);
                $("#name").html(name);
                if(parent.setIframeHeight) {
                    parent.setIframeHeight($("#content-box").height() + 150);
                }
            }
        }
        var app = new VueRoot({
            template: 'public/pages/tplView/tplView.html',
            data: storage,
            store: store,
            created: function() {},
            mounted: function() {
                var code = "";
                $(".g-footer").remove();
                if(parent.getCode) {
                    code = parent.getCode();
                    this.code = code;
                }
                if(parent.setIframeHeight) {
                    parent.setIframeHeight($(document).height() + 150);
                }
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
