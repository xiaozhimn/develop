var db = require("../common/connect");
var tools = require("../common/tools").tools;
Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
var menu = {
    select: function(params, callback) {
        var conn = db.connect();
        conn.query('select id,name from menu where parentId=0', function(err, rows, fields) {
            if(err) {
                callback(false);
            } else {
                callback(rows);
            }
        });
    },
    selectChildMenuItem: function(params, callback) {
        var conn = db.connect();
        var platId = params.platId;
        conn.query('select id,name from menu where parentId=' + platId, function(err, rows, fields) {
            if(err) {
                callback(false);
            } else {
                callback(rows);
            }
        });
    },
    selectArticalMenuItem: function(params, callback) {
        var conn = db.connect();
        var platId = params.platId;
        this.selectChildMenuItem(params, function(result) {
            if(result) {
                for(var index = 0; index < result.length; index++) {
                    result[index]["hasNext"] = true;
                }
                conn.query('select artical.name,artical.id from menu,artical where artical.plat_id=' + platId + ' and artical.plat_id=menu.id order by artical.id asc', function(err, rows, fields) {
                    if(err) {
                        callback(false);
                    } else {
                        callback(result.concat(rows));
                    }
                });
            }
        });
    },
    getTop10ArticalList: function(params, callback) {
        var conn = db.connect();
        conn.query('select artical.name,artical.id,artical.update_time,menu.name as plat from artical,menu where artical.plat_id=menu.id order by artical.update_time desc limit 0,10', function(err,rows) {
            if(err) {
                callback(false);
            } else {
                for(var index = 0; index < rows.length; index++) {
                    var time = new Date(rows[index]["update_time"]);
                    rows[index].update_time = time.format('yyyy-MM-dd');
                }
                callback(rows);
            }
        })
    }
}
exports.menu = menu;