/*
*通用service，为所有页面提供通用api接口
* */
var commonService = {
    urls: {
        'checkLogin': '/api/v1/checkLogin'
    },
    checkLogin: function(config, callback){
        Api.post(this.urls.checkLogin, config, callback);
    }
}
module.exports = commonService;