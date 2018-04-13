var itemService = {
    urls: {
        'artical': '/api/v1/publishArtical',
        'getPlatForm': '/api/v1/getMenuTree',
        'getModule': '/api/v1/getModule',
        'getOneItem': '/api/v1/getSingleArticalContent'
    },
    artical: function (config, callback) {
        Api.post(this.urls.artical, config, callback);
    },
    getPlatForm: function (callback) {
        Api.get(this.urls.getPlatForm, callback);
    },
    getModule: function (config, callback) {
        Api.get(this.urls.getModule, config, callback);
    },
    getOneItem: function (config, callback) {
        Api.get(this.urls.getOneItem, config, callback);
    }
};
module.exports = itemService;
