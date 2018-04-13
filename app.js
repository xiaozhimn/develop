var fs = require("fs");
cluster = require('cluster');
var numCPUs = require('os').cpus().length;
global.app = require("./utils/utils").conf.init().app;
port = 80;
var isOpenCluster = false;//是否开启多进程处理器提高并发量
require("./app/common/redisClient");//服务器启动同时启动redis
if(isOpenCluster) {
    if (cluster.isMaster) {
        mainProcessId = process.pid;
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on('listening', function (worker, address) {
            console.log("worker:" + worker.id + " start at" + port);
        });

    } else if (cluster.isWorker) {
        app.watch(port);
    }
} else {
    app.watch(port);
    console.log("server start at " + port);
}
process.on('uncaughtException', function (err) {
    console.log(err);
});