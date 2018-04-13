var movieListService = {
    urls: {
        getMovieList: "/api/v1/getMovieList",
        deleteMovieList: "/api/v1/deleteMovie"
    },
    getMovieList: function(config, callback) {
        Api.get(this.urls.getMovieList, config, callback);
    },
    deleteMovieList: function(config, callback) {
        Api.get(this.urls.deleteMovieList, config, callback);
    }
}
module.exports = movieListService;
