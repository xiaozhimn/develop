/*
 * 将css和html可以一并写入到这个文件中
 * */

var prompts={};
(function() {

    prompts.init = function(type,msg) {
    if($("#prompt").length > 0) {
      $("#prompt").remove();
    }
    var className;
    if(type==="warning"){
        className = '<div class="prompt-warning-icon"></div>'
    }else if(type==="success"){
        className = '<div class="prompt-success-icon"></div>'
    }else{
        className = '<div class="prompt-notify-icon"></div>'
    }

    var divEle =    '<div id="prompt">'+
        '<div class="prompt-box '+ type + '">' + className +
        '<div class="msgStyle">'+ msg +'</div>' +
        '<div class="prompt-close-btn" ></div>'+
        '</div>'+
        '</div>';


    $("body").append(divEle);

    $(".prompt-close-btn").click(function () {
      $('#prompt').css('display','none')
    })
  }
})();