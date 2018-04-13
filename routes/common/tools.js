var fs = require("fs");
// var sliderConfig = JSON.parse(fs.readFileSync("public/widget/slider/sliderConfig.json"));
var seoData = null;
function clone(obj){
    var o;
    if(typeof obj == "object"){
        if(obj === null){
            o = null;
        }else{
            if(obj instanceof Array){
                o = [];
                for(var i = 0, len = obj.length; i < len; i++){
                    o.push(clone(obj[i]));
                }
            }else{
                o = {};
                for(var k in obj){
                    o[k] = clone(obj[k]);
                }
            }
        }
    }else{
        o = obj;
    }
    return o;
}
var Tools = {
    // getPageSliderData: function(pageName) {
    //     var sliderData = clone(sliderConfig[pageName]);
    //     return sliderData;
    // },
    isCacheTimeOut: function(clientTimeStamp) {
        return timestamp == clientTimeStamp;
    },
    getSliderData: function(callback) {
        Api.get('/api/v1/getMenuTree', {}, function(result){
            callback(result);
        });
    },
    getSubMenuData: function(id, callback) {
        var config = {
            urlParams: {
                platId: id
            }
        };
        Api.get('/api/v1/getArticalMenuItems', config, function(result){
            callback(result);
        });
    }
}
module.exports = Tools;
