var tplService = {
    urls: {
        saveTpl: "/api/v1/publishTpl",
        getTplMenuList: "/api/v1/getTplMenuList",
        getTplSigleContent: "/api/v1/getTplSigleContent",
        deleteTpl: "/api/v1/deleteTpl",
        saveStyleContent: "/api/v1/saveStyleContent",
        getStyleContent: "/api/v1/getStyleContent"
    },
    saveTpl: function(config, callback) {
        Api.post(this.urls.saveTpl, config, callback);
    },
    getTplMenuList: function(callback) {
        Api.get(this.urls.getTplMenuList, callback);
    },
    getTplSigleContent: function(config, callback) {
        Api.get(this.urls.getTplSigleContent, config, callback);
    },
    deleteTpl: function(config, callback) {
        Api.get(this.urls.deleteTpl, config, callback);
    },
    saveStyleContent: function(config, callback) {
        Api.post(this.urls.saveStyleContent, config, callback);
    },
    getStyleContent: function(callback) {
        Api.get(this.urls.getStyleContent, callback);
    }
}
module.exports = tplService;
