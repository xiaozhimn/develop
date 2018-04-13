var docsService = {
    urls: {
        'getSingleArticalContent': '/api/v1/getSingleArticalContent',
        'getPrevAndNextArticalId': '/api/v1/getPrevAndNextArticalId',
        'getArticalMenuItems': '/api/v1/getArticalMenuItems',
        'getCommentForArtical':'/api/v1/getCommentForArtical',
        'thumbUpForArtical':'/api/v1/thumbUpForArtical',
        'publishCommentForArtical':'/api/v1/publishCommentForArtical',
        'replyCommenter':'/api/v1/replyCommenter'
    },
    getSingleArticalContent: function(config, callback){
        Api.get(this.urls.getSingleArticalContent, config, callback);
    },
    getPrevAndNextArticalId: function(config, callback){
        Api.get(this.urls.getPrevAndNextArticalId, config, callback);
    },
    getArticalMenuItems: function(config, callback){
        Api.get(this.urls.getArticalMenuItems, config, callback);
    },
    getCommentForArtical: function (config, callback) {
        Api.get(this.urls.getCommentForArtical, config, callback);
    },
    replyCommenter:function (config, callback) {
        Api.get(this.urls.replyCommenter, config, callback);
    },
    thumbUpForArtical:function (config, callback) {
        Api.get(this.urls.thumbUpForArtical, config, callback);
    },
    comment:function (config, callback) {
        Api.post(this.urls.publishCommentForArtical, config, callback);
    }
}
module.exports = docsService;
