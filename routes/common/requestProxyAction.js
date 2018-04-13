var $ = require("./request");
var fs = require("fs");
var http = require("http");
var path = require('path');
function getClientIp(req) {
    var clientIp = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    if(clientIp.indexOf("f:") > -1) {
        return clientIp.split("f:")[1];
    } else {
        return clientIp;
    }
}
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
function postFile(fileKeyValue, req) {
    var boundaryKey = Math.random().toString(16);
    var enddata = '\r\n----' + boundaryKey + '--';
    var files = new Array();
    for (var i = 0; i < fileKeyValue.length; i++) {
        var content = "\r\n----" + boundaryKey + "\r\n" + "Content-Type: " + fileKeyValue[i].contentType + "\r\n" + "Content-Disposition: form-data; name=\"" + fileKeyValue[i].urlKey + "\"; filename=\"" + path.basename(fileKeyValue[i].urlValue) + "\"\r\n" + "Content-Transfer-Encoding: binary\r\n\r\n";
        var contentBinary = new Buffer(content, 'utf-8');//当编码为ascii时，中文会乱码。
        files.push({contentBinary: contentBinary, filePath: fileKeyValue[i].urlValue});
    }
    var contentLength = 0;
    for (var i = 0; i < files.length; i++) {
        var stat = fs.statSync(files[i].filePath);
        contentLength += files[i].contentBinary.length;
        contentLength += stat.size;
    }

    req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
    req.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));

    // 将参数发出
    var fileindex = 0;
    var doOneFile = function(){
        req.write(files[fileindex].contentBinary);
        var fileStream = fs.createReadStream(files[fileindex].filePath, {bufferSize : 4 * 1024});
        fileStream.pipe(req, {end: false});
        fileStream.on('end', function() {
            fileindex++;
            if(fileindex == files.length){
                req.end(enddata);
            } else {
                doOneFile();
            }
        });
    };
    if(fileindex == files.length){
        req.end(enddata);
    } else {
        doOneFile();
    }
}
function delQueStr(url, ref) {
    var str = "";
    if (url.indexOf('?') != -1) {
        str = url.substr(url.indexOf('?') + 1);
    }
    else {
        return url;
    }
    var arr = "";
    var returnurl = "";
    var setparam = "";
    if (str.indexOf('&') != -1) {
        arr = str.split('&');
        for (i in arr) {
            if (arr[i].split('=')[0] != ref) {
                returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
            }
        }
        return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
    }
    else {
        arr = str.split('=');
        if (arr[0] == ref) {
            return url.substr(0, url.indexOf('?'));
        }
        else {
            return url;
        }
    }
}
exports.requestProxyAction = function(req, res) {
    var url = req.url;
    var headers = req.headers;
    var method = req.method;
    var param = req.body;
    var clientIp = getClientIp(req);
    var routeName = decodeURIComponent(req.query.routeName ? req.query.routeName : "");
    if(headers) {
        headers["X-Real-IP-Cus-Node"] = clientIp;
    }
    if(url.indexOf("routeName") > -1) {
        url = delQueStr(url, "routeName");
    }
    function isNeedLogin() {
        if(param && routeName) {
            for(var index = 0; index < routeList.length; index++) {
                if(routeName == routeList[index].route) {
                    return routeList[index].isLogin;
                }
            }
        }
        return false;
    }
    function getEncoding(url) {
        if(url.indexOf("getcodeimage") > -1) {
            return "binary";
        } else if(url.indexOf(globalConfig.fileProxyPathKey) > -1) {
            return "binary";
        }
        return null;
    }
    function getUrl(url) {
        if(url.indexOf(globalConfig.apiProxyPathKey) > -1) {
            return "http://" + Api.host + ":" + Api.port + url;
        } else if(url.indexOf(globalConfig.fileProxyPathKey) > -1) {
            return "http://" + Api.fileHost + ":" + Api.filePort + url;
        }
        return "";
    }
    if(headers && headers["content-type"] && headers["content-type"].indexOf("multipart/form-data") > -1) {//代理文件上传
        var files = [];
        for(var key in req.files) {
            files.push({
                urlKey: key,
                urlValue: req.files[key].path,
                contentType: req.files[key].headers["content-type"]
            });
        }
        if(!headers["x-token"]) {
            delete headers["x-token"];
        }
        var options = {
            host: Api.host,
            port: Api.port ,
            method: "POST",
            path: url,
            headers: headers
        }

        var request = http.request(options, function(response) {
            response.on("data", function(chunk){
                try {
                    res.json(JSON.parse(chunk.toString()));
                } catch(e) {
                    res.json({"errorCode": "-1", "msg": "服务器异常", data: null});
                }
            })
        })

        request.on('error', function(e){
            res.json({"errorCode": "-1", "msg": "上传失败", data: null});
        })
        postFile(files, request);

    } else {//代理Api
        $.ajax({
            url: getUrl(url),
            type: method,
            headers: headers,
            data: param,
            encoding: getEncoding(url),
            success: function (result, response) {
                if(url.indexOf("getcodeimage") > -1 || url.indexOf(globalConfig.fileProxyPathKey) > -1) {
                    if(typeof result != "object") {
                        res.writeHead(200, response.headers);
                        var buffer = new Buffer(result, 'binary');
                        res.write(buffer, "binary");
                        res.end();
                    } else {
                        res.json(result);
                    }
                } else {
                    if(response && response.headers && response.headers["set-cookie"]) {
                        var cookies = response.headers["set-cookie"].toString().split(";");
                        for(index = 0; index < cookies.length; index++) {
                            var key = cookies[index].split("=")[0];
                            var value = cookies[index].split("=")[1];
                            if(key == "JSESSIONID") {
                                res.cookie('JSESSIONID', value);
                                break;
                            }
                        }
                    }
                    if (typeof result == "object") {
                        if(result.errorCode == 401) {
                            if(isNeedLogin()) {
                                res.json({
                                    "errorCode": "401",
                                    "isLogin": true
                                });
                                res.end();
                            } else {
                                res.json(result);
                                res.end();
                            }
                        } else {
                            res.json(result);
                            res.end();
                        }
                    } else {
                        res.json({"errorCode": "-1", errorMsg: "服务器接口错误", data: null});
                    }
                }
            }
        });
    }
};