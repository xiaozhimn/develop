var registerService = {
    urls: {
        'register': '/api/v1/regist'
    },
    register: function(config, callback){
        Api.post(this.urls.register, config, callback);
    }
}
module.exports = registerService;
