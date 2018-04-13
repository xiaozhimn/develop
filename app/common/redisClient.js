var redis = require('redis'),
    RDS_PORT = 6379,                //端口号
    RDS_HOST = '118.178.231.7',    //服务器IP  要连接的A服务器redis
    RDS_PWD = '244974000mn!',     //密码
    RDS_OPTS = {},                  //设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
    global.redisConn = {};
client.auth(RDS_PWD,function(){});
client.on('connect',function(){
    console.log('redis 链接成功!');
    global.redisConn = client;
});
client.on('ready',function(err){});