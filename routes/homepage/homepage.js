var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.homepage = function(req, res) {
    use(["public/pages/homepage/store.js", "public/pages/homepage/homepage.js", "public/pages/homepage/homepageService.js"], function(store, app, homepageService) {
        var storage = {
            tableList:{
                list:[],
                totalCount:'',
                currentPage:'',
                pageSize:''
            }
        };//前后端共享数据
        var state = {};//所有组件共享数据

        function getUserPublishedArticalList(){
            var config = {
                headers: req.headers,
                urlParams: {
                    currentPage: 1
                }
            };
            homepageService.getUserPublishedArticalList(config, function(result) {
                if(result.errorCode == 0){
                    storage["tableList"] = result.data;
                } else {
                    console.log("出错了。。。。。。",result)
                }
                renderEngin.call(res, 'homepage', app, storage, state, store);
            });
        }
        getUserPublishedArticalList();
    }, "homepage");
}