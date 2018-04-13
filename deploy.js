var process = require('child_process');
var url = require('url');
var query = require("querystring");
var Client = require('ssh2').Client;
function stringReplaceAll(str, AFindText,ARepText){
    var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g,"\\$1"),"ig");
    return str.replace(raRegExp,ARepText);
}
console.log("[正在部署请等候.....]");
//var cmd = "cd " + dir +  " \n chmod 777 v1.0 \n rm -rf v1.0/* \n " + "svn co " + svn + "/v1.0/ --username zhufengbo --password 123456 \n chmod -R 777 v1.0 \n supervisorctl restart all";
var cmd = "cd /home/ue2 \n rm -rf ue2 \n git clone -b develop git@120.132.124.126:zhangqi/ue2.git \n supervisorctl restart all";
var ip = "118.178.231.7";
var conn = new Client();
var password = "244974000Mn!";
conn.on('ready', function() {
    conn.exec(cmd, function(err, stream) {
        stream.on('exit', function() {
            console.log("[部署完成......]");
        });
    });
}).connect({
    host: ip,
    username: 'root',
    password: password,
});