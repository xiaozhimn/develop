use([
    "public/pages/login/store.js",
    "public/pages/login/loginService.js"
], function() {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/login/login.html',
            data: {
                storage: storage,
                username: '',
                password: '',
                loginTip: ''
            },
            store: store,
            created: function() {

            },
            mounted: function() {
                $(".navbar-item li a").removeClass("active");
            },
            methods: {
                formValidate: function(){
                    if(!this.username || !this.password){
                        this.loginTip = '用户名或密码不能为空！';
                        return false;
                    }else{
                        this.loginTip = '';
                        return true;
                    }
                },
                login: function(){
                    if(this.formValidate()){
                        var _this = this;
                        var pageFrom = easyVue.getQueryString("from");
                        pageFrom = pageFrom ? '/' + pageFrom : '/';
                        var config = {
                            urlParams: {
                                username: this.username,
                                password: this.password
                            }
                        };
                        loginService.login(config, function(res){
                            if(res.errorCode == 0){
                                _this.loginTip = '';
                                window.location.href = pageFrom;
                            }else{
                                _this.loginTip = res.msg;
                            };
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
