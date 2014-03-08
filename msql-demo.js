/*
var conn = mysql.createConnection({
	host:'localhost', 
	user:'root', 
	password:'root',
	database:'test'
});

conn.connect();

conn.query('SELECT * FROM user', function(err, rows, fields) {
  if (err) throw err;

  console.log('The id is: ', rows[0].id);
});

conn.end();

*/


// 采用连接池模式
var pool = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'root',
	database:'test',
	charset:'UTF8_GENERAL_CI',
	port:'3306'
});

pool.getConnection(function(err, connection){
	if (err) throw err;

	connection.query('SELECT * FROM user', function(err, rows, fields) {
  		if (err) throw err;
  		console.log('The id is: ', rows[0].id);
  		connection.release();
	});
});
