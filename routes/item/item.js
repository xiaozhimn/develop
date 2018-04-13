var async = require("async");
var renderEngin = require("../common/renderEngin");
exports.item = function (req, res) {
    use(["public/pages/item/store.js", "public/pages/item/item.js", "public/pages/item/itemService.js"], function (store, app, itemService) {
        var storage = {
            'info': {}
        };//前后端共享数据
        var state = {};//所有组件共享数据

        function getOneItem() {
            var config = {
                headers: req.headers,
                urlParams: {
                    articalId: req.query.id
                }
            };

            itemService.getOneItem(config, function(result){
                if(result.errorCode == 0){
                    if(result.data["content"]) {
                        result.data["content"] = decodeURIComponent(result.data["content"]);
                    }
                    storage["info"] = result.data || {};
                    storage["info"]["articalId"] =  req.query.id || 0;
                }
                renderEngin.call(res, 'item', app, storage, state, store);
            });
        }

        if (req.query.id) {
            getOneItem();
        }else{
            renderEngin.call(res, 'item', app, storage, state, store);
        }
    }, "item");
};