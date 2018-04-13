var indexService = {
    urls: {
        getTop20Artical: "/api/v1/getTop10ArticalList",
        getNewMovieList: "/api/v1/getNewMovieList"
    },
    getTop20Artical: function(callback) {
        Api.get(this.urls.getTop20Artical, callback);
    },
    getNewMovieList: function(callback) {
        Api.get(this.urls.getNewMovieList, callback);
    }
}
module.exports = indexService;
