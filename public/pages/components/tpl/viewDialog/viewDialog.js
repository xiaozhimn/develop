use([], function() {
    Vue.component('viewDialogComponent', {
        pageName: "tpl",
        props:["isShowDialog"],
        template: "public/pages/components/tpl/viewDialog/viewDialog.html",
        data:function() {
            return {
                isShow: true
            }
        },
        created: function() {},
        mounted: function() {
            this.isShow = true;
        },
        methods: {
            closeViewer: function() {
                this.isShow = false;
            }
        }
    });
});

var Dialog = {
    viewDialg: null,
    init: function(config) {
        var userName = config.userName;
        this.viewDialog = Vue.extend({
            template: "<viewDialogComponent :isShowDialog='true' :username=" + username + "></viewDialogComponent>"
        });
        return this;
    },
    show: function() {
        $("#viewer").html("");
        var component = new this.viewDialog().$mount();//挂载到内存节点上
        var viewerEle = $("<div id='viewer'></div>");
        $("#content-box").append(viewerEle);
        viewerEle.append($(component.$el));
    }
}