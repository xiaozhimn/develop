var homepageService = {
    urls: {
        'getUserPublishedArticalList': '/api/v1/getUserPublishedArticalList',
        'searchUserSelfPublishedArtical': '/api/v1/searchUserSelfPublishedArtical',
        'deleteSingleArtical': '/api/v1/deleteSingleArtical',
        'getPlatForm': '/api/v1/getMenuTree'
    },
    getUserPublishedArticalList: function(config, callback){
        Api.get(this.urls.getUserPublishedArticalList, config, callback);
    },
    searchUserSelfPublishedArtical: function(config, callback){
        Api.get(this.urls.searchUserSelfPublishedArtical, config, callback);
    },
    deleteSingleArtical: function(config, callback){
        Api.get(this.urls.deleteSingleArtical, config, callback);
    },
    getPlatForm: function (config, callback) {
        Api.get(this.urls.getPlatForm, config, callback);
    }
};
module.exports = homepageService;
