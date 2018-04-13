use([
    "public/pages/register/store.js",
    "public/pages/register/registerService.js"
], function() {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/register/register.html',
            data: {
                storage: storage,
                username: '',
                usernameFormatTip: '',
                password: '',
                passwordStrengthTip: '',
                confirmPassword: '',
                confirmPasswordTip: ''
            },
            store: store,
            created: function() {
            },
            mounted: function() {
                $(".navbar-item li a").removeClass("active");
            },
            methods: {
                checkUsernameFormat: function(){
                    var reg = /^([\w\-]+)$/;
                    if(reg.test(this.username)){
                        this.usernameFormatTip = '';
                    }else{
                        this.usernameFormatTip = '请输入数字、大小写字母或符号"_"、"-"';
                    }
                },
                checkPasswordFormat: function(){
                    var password = this.password,
                        level = 0,
                        mode = 0;

                    if(password == null || password == '' || password == undefined){
                        mode = 0;
                        this.passwordStrengthTip = '密码不能为空！';
                        return;
                    }else{
                        for(var i = 0; i < password.length; i++){
                            var charMode;
                            var regSpecial = /((?=[\x21-\x7e]+)[^A-Za-z0-9])/;
                            var regNumber = /[0-9]+/;
                            var regLowercase = /[a-z]+/;
                            var regCapital = /[A-Z]+/;

                            var singleWord = password.charAt(i);

                            //判断输入密码的类型
                            if(regNumber.test(singleWord)){ //数字
                                charMode = 1;
                            }else if(regCapital.test(singleWord)){ //大写
                                charMode = 2;
                            }else if(regLowercase.test(singleWord)){ //小写
                                charMode = 4;
                            }else if(regSpecial.test(singleWord)){ //特殊字符
                                charMode = 8;
                            }else{
                                // 不支持的字符
                                this.passwordStrengthTip = '密码格式不正确，请重新输入！';
                                return;
                            }

                            mode |= charMode;
                            var typeNumber = this.CalcLevel(mode);
                        }

                        if(typeNumber == 0 || password.length > 18){
                            this.passwordStrengthTip = '密码强度过低，请重新输入！';
                        }else if(typeNumber <= 2 || password.length < 6){
                            this.passwordStrengthTip = '密码强度过低，请重新输入！'
                        }else if((password.length >=6 && password.length <=9 && typeNumber == 3) ||
                            (password.length >=6 && password.length <=7 && typeNumber == 4)){
                            this.passwordStrengthTip = '';
                        }else if((password.length >=10 && password.length <=18 && typeNumber == 3) ||
                            (password.length >=8 && password.length <=18 && typeNumber == 4))
                        {
                            this.passwordStrengthTip = '';
                        }else{
                            this.passwordStrengthTip = '密码强度过低，请重新输入！';
                        }
                    }
                },
                clearPasswordTip: function(){
                    this.passwordStrengthTip = '';
                    this.confirmPasswordTip = '';
                },
                confirmPasswordEqual: function(){
                    if($.trim(this.password) != $.trim(this.confirmPassword)){
                        this.confirmPasswordTip = '两次输入的密码不一致,请重新输入';
                    }else{
                        this.confirmPasswordTip = '';
                    }
                },
                CalcLevel: function(mode){
                    var level = 0;
                    for(var indexj=0;indexj<4;indexj++){
                        if(mode & 1) {
                            level++;
                        }
                        mode >>>=1;
                    }
                    return level;
                },
                registerAccount: function(){
                    var _this = this;
                    if(this.formValidate()){
                        var config = {
                            urlParams: {
                                username: this.username,
                                password: this.password
                            }
                        };
                        registerService.register(config, function(res){
                            if(res.errorCode == 0){
                                if(confirm("注册成功，请登录！")){
                                    window.location.href = '/login';
                                }else{
                                    window.location.href = '/index';
                                }
                            }else{
                                _this.usernameFormatTip = res.msg;
                                return;
                            }
                        })
                    }
                },
                formValidate: function(){
                    this.checkUsernameFormat();
                    this.checkPasswordFormat();
                    this.confirmPasswordEqual();
                    if(this.usernameFormatTip || this.passwordStrengthTip || this.confirmPasswordTip){
                        return false;
                    }else{
                        return true;
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
