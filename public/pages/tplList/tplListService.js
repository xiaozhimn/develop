var tplListService = {
    urls: {
        getTplMenuList: "/api/v1/getTplMenuList",
        getTplSigleContent: "/api/v1/getTplSigleContent"
    },
    getTplMenuList: function(callback) {
        Api.get(this.urls.getTplMenuList, callback);
    },
    getTplSigleContent: function(config, callback) {
        Api.get(this.urls.getTplSigleContent, config, callback);
    }
}
module.exports = tplListService;
