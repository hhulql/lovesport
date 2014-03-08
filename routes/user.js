
/*
 * User API 
 */

exports.UserLogin = mapping(login);

function login(connection, req, res) {
	console.log(req.query);

	var username = req.query.UserName;
	var password = req.query.Password;
	var ostype = req.query.OSType;
	var clientVersion = req.query.ClientVersion;

	//	关键参数验证
	if (!username || !password) {
		res.send({'ActionResult':1, 'Err':'UserName or Password is missing'});
		return ;
	}

  	console.log("the login username is :" + username);

	var sql = 'SELECT * FROM t_user where account = ? and password = ?';
	connection.query(sql, [username, password], function(err, rows, fields) {
	  		if (err) {
	  			res.send('查询数据库发生错误');
	  			return ;
	  		}

	  		console.log(rows);
	  		//console.log(fields);

	  		if (rows.length == 0) {
	  			console.log('用户登录失败');
	  			res.send({'ActionResult':1, 'UserName':username});
	  		} else {
	  			console.log('用户登录成功');
	  			res.send({'ActionResult':0, 'UserName':username});
	  		}


	  		connection.release();
	});
}