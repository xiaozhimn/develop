use([
    "public/widget/prompt/prompt.js"
], function() {
    Vue.component('tableComponent', {
        pageName: "movieList",
        template: "public/pages/components/movieList/table/table.html",
        props:["movieList"],
        data:function() {
            return {}
        },
        created: function() {},
        mounted: function() {},
        destroyed: function() {},
        methods: {
            deleteMovie: function(id) {
                if(window.confirm("是否确定删除?")) {
                    movieListService.deleteMovieList({
                        urlParams: {
                            id: id
                        }
                    }, function (result) {
                        if (result.data) {
                            location.reload();
                        } else {
                            prompts.init("warning", "删除数据失败!");
                        }
                    });
                }
            }
        }
    });
});