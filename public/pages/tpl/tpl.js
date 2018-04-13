use([
    "public/pages/tpl/store.js",
    "public/pages/tpl/tplService.js",
    "public/widget/prompt/prompt.js",
    "public/pages/components/tpl/viewDialog/viewDialog.js"
], function() {
    function init(storage, store) {
        var editor = null;
        var styleEditor = null;
        if(typeof window != "undefined") {
            window.getCode = function () {
                return editor.getValue();
            }
        }
        var app = new VueRoot({
            template: 'public/pages/tpl/tpl.html',
            data: storage,
            store: store,
            created: function() {},
            mounted: function() {
                editor = CodeMirror.fromTextArea(document.getElementById("code-box"), {
                    lineNumbers: true,
                    smartIndent: false,
                    height: "600px",//设置初始化高度
                    matchBrackets: true
                });
                editor.setOption("theme", "mdn-like");
                editor.setValue($.trim(editor.getValue()));

                styleEditor = CodeMirror.fromTextArea(document.getElementById("style-code"), {
                    lineNumbers: true,
                    smartIndent: false,
                    height: "600px",//设置初始化高度
                    matchBrackets: true
                });
                styleEditor.setOption("theme", "mdn-like");
                styleEditor.setValue($.trim(styleEditor.getValue()));
            },
            methods: {
                save: function() {
                    var code = encodeURIComponent(editor.getValue());
                    var name = this.name;
                    var tplId = easyVue.getQueryString("id") || "";
                    tplService.saveTpl({
                        urlParams: {
                            name: name,
                            content: code,
                            tplId: tplId
                        }
                    }, function(result) {
                        if(result.errorCode == "-1") {
                            prompts.init("warnning", result.msg);
                        } else {
                            prompts.init("success", "发布成功");
                            window.location.href = "/tpl";
                        }
                    });
                },
                showSheetStyle: function() {
                    this.isShowTpl = false;
                },
                saveStyle: function() {
                    if(!this.styleContent) {
                        prompts.init("warnning", "所填信息不能为空！");
                        return;
                    }
                    tplService.saveStyleContent({
                        urlParams: {
                            styleContent: styleEditor.getValue()
                        }
                    }, function(result) {
                        if(result.errorCode == "-1") {
                            prompts.init("warnning", result.msg);
                        } else {
                            prompts.init("success", "保存成功");
                        }
                    });
                },
                viewTpl: function() {
                    $("#viewer").html("");
                    var viewDialog = Vue.extend({
                        template: "<viewDialogComponent :isShowDialog='true'></viewDialogComponent>"
                    });
                    var component = new viewDialog().$mount();//挂载到内存节点上
                    $("#viewer").append($(component.$el));
                },
                deleteTpl: function() {
                    if(window.confirm("是否确定删除?")) {
                        var tplId = easyVue.getQueryString("id") || "";
                        tplService.deleteTpl({
                            urlParams: {
                                id: tplId
                            }
                        }, function(result) {
                            if(result.errorCode == "-1") {
                                prompts.init("warnning", result.msg);
                            } else {
                                prompts.init("success", "删除成功");
                                window.location.href = "/tpl";
                            }
                        });
                    }
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
