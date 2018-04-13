var mysql = require('mysql');
var pool = mysql.createPool({
	queueLimit:8,
	host: 'localhost',
	user: 'root',
	password: 'root',
	database:'ue2',
	port: 3306
});
function connect() {
	return {
		pool: pool,
		query: function(sql, callback) {
			pool.getConnection(function(err,conn){
				if(err){
					callback(err,null,null);
				} else {
					conn.query(sql,function(qerr,vals,fields) {
						//事件驱动回调
						callback(qerr,vals,fields);
						//释放连接
						conn.release();
					});
				}
			});
		}
	}
}
exports.connect = connect;
