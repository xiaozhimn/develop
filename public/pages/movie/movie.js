use([
    "public/pages/movie/store.js",
    "public/pages/movie/movieService.js",
    "public/widget/prompt/prompt.js"
], function() {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/movie/movie.html',
            data: storage,
            store: store,
            created: function() {},
            mounted: function() {

            },
            methods: {
                changeType: function(item) {
                    this.defaultName = item;
                },
                publish: function() {
                    var self = this;
                    self.isCanNotClicked = true;
                    var xhrOnProgress=function(fun) {
                        xhrOnProgress.onprogress = fun; //绑定监听
                        //使用闭包实现监听绑
                        return function() {
                            //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
                            var xhr = $.ajaxSettings.xhr();
                            //判断监听函数是否为函数
                            if (typeof xhrOnProgress.onprogress !== 'function')
                                return xhr;
                            //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
                            if (xhrOnProgress.onprogress && xhr.upload) {
                                xhr.upload.onprogress = xhrOnProgress.onprogress;
                            }
                            return xhr;
                        }
                    }
                    $.ajax({
                        url: "/api/v1/saveMovie",
                        type: 'POST',
                        cache: false,
                        data: new FormData($('#movie-form')[0]),
                        processData: false,
                        contentType: false,
                        dataType:"json",
                        xhr:xhrOnProgress(function(e){
                            var percent=e.loaded / e.total;
                            console.log(Math.round(percent) * 100);
                        }),
                        success : function(result) {
                            if(result.errorCode == "-1") {
                                prompts.init("warning", result.msg);
                                self.isCanNotClicked = false;
                            } else {
                                prompts.init("success", "发布成功");
                                window.location.href = "/movieList";
                            }
                        }
                    });
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
