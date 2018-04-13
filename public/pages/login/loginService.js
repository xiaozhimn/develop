var loginService = {
    urls: {
        'login': '/api/v1/login'
    },
    login: function(config, callback){
        Api.post(this.urls.login, config, callback);
    }
}
module.exports = loginService;
