var mysql = require('mysql');
console.log('loading utils module');
// 采用连接池模式，使用全局对象，这样其它module可以使用pool对象
pool = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'root',
	database:'activity_db',
	charset:'UTF8_GENERAL_CI',
	port:'3306'
});

 