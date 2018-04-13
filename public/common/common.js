/**
 * Created by hna on 17/12/25.
 */
$(function () {
    highlightNavbarItem();
    var username = cookie.get('username');
    var  htmlOfLogin = '<li><a href="javascript:;" class="login" id="loginBtn">登录</a></li><li><a href="/register" class="register">注册</a></li>';
    var  htmlOfPortait ='<li class="dropdown">' +
        '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">' +
        username +
        '<b class="caret"></b>' +

        '</a>' +
        '<ul class="dropdown-menu">' +
        '<li><a href="/userinfo">我的主页</a></li>' +
        '<li><a href="/homepage">我的文章</a></li>' +
        '<li><a href="/movie">发布视频</a></li>' +
        '<li><a href="/tpl">发布样式组件</a></li>' +
        '<li><a href="javascript:;" id="logout">退出登录</a></li>' +
        '</ul>' +
        '</li>';
    var token = cookie.get('token');
    if(!token){
        $("#blankPosition").html(htmlOfLogin);
    }else{
        //校验token
        $.get('/api/v1/checkLogin', {token:token}, function(res){
            if(res.errorCode == 0){
                $("#blankPosition").html(htmlOfPortait);
            }else{
                clearCookie();
                $("#blankPosition").html(htmlOfLogin);
            }
        });
    }

    $(document).on("click", "#loginBtn", function(){
        var pageName = window.location.href.split("/")[3];
        window.location.href = '/login?from=' + pageName;
    });

    $(document).on("click","#logout", function(){
        clearCookie();
        window.location.href = '/index';
    });

    $(".navbar-item").on("click","li a", function(){
       $(".navbar-item li a").removeClass("active");
       $(this).addClass("active");
    });

    function clearCookie(){
        cookie.delete('token');
        cookie.delete('userId');
        cookie.delete('username');
    };

    function highlightNavbarItem(){
        var hrefs = window.location.href;
        $(".navbar-item li a").removeClass("active");
        // $(".homepage-slider li").removeClass("active");
        if(hrefs.indexOf('index') > -1){
            $(".navbar-item li:eq(0) a").addClass("active");
        }else if(hrefs.indexOf('docs') > -1){
            $(".navbar-item li:eq(1) a").addClass("active");
        }else if(hrefs.indexOf('team') > -1){
            $(".navbar-item li:eq(2) a").addClass("active");
        }else{
            $(".navbar-item li a").removeClass("active");
        }

        // if(hrefs.indexOf("userinfo") > -1){
        //     $(".homepage-slider ul li:eq(0)").addClass("active");
        // }else{
        //     $(".homepage-slider ul li:eq(1)").addClass("active");
        // }
    };
})

Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}