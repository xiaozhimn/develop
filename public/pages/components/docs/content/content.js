use([], function() {
    Vue.component('contentComponent', {
        pageName: "docs",
        template: "public/pages/components/docs/content/content.html",
        props: ["pageContent", "articalData"],
        data:function() {
            return {}
        },
        created: function() {},
        mounted: function() {},
        methods: {}
    });
});
