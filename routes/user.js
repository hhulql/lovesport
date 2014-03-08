
/*
 * User API 
 */

exports.UserLogin = mapping(login);
exports.DayInfo = mapping(getDayInfo);

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
};

/**
参数：account
*/
function getDayInfo(connection, req, res) {
	var result = {success:true, errorMsg:'用户当天暂无活动数据', account:username, 
		distance:0, sportTime:0, studyTime:0,
		events:0, finishedEvents:0
	};

	var count = 0;
	function done() {
		count += 1;
		if (count == 3) {
			res.send(result);
		}
	}

	var username = req.query.UserName;
	var curDate = moment().format('YYYY-MM-DD');
	console.log(curDate);

	var curEventSql = 'SELECT * FROM t_user_event_his h, t_user u' 
		+ ' where h.user_id = u.id' 
		+ ' and u.account = ?'
		+ ' and h.join_date = str_to_date(?, "%Y-%m-%d")';

	connection.query(curEventSql, [req.query.account, curDate], function(err, rows, fields) {
		if (err) {
			res.send({success:false, errorMsg:'查询用户当天活动数据出错'});
			return ;
		}
		console.log(rows);

		if (rows.length == 0) {
			res.send(result);
			return ;	
		} else if (rows.length >= 0) {
			var r = rows[0];
			result.distance = r.run_distance;
			result.sportTime = r.sport_time;
			result.studyTime = r.study_time;
		}

		done();
	});

	//查询当前已完成的活动
	var curFinishActivitySql = 'SELECT count(1) count FROM activity_db.t_user_activity ua, t_activity a, t_user u '
		+ ' where str_to_date(?, "%Y-%m-%d") >= a.start_date '
		+ ' and str_to_date(?, "%Y-%m-%d")  <= a.end_date '
		+ ' and ua.user_id = u.id '
		+ ' and ua.activity_id = a.id '
		+ ' and ua.finish_status = 1 '
		+ ' and u.account = ? ';
	console.log(curFinishActivitySql);
	connection.query(curFinishActivitySql, [curDate, curDate, req.query.account], function(err, rows, fields) {
		if (err) {
			res.send({success:false, errorMsg:'查询用户当天活动数据出错'});
			return ;
		}
		console.log(rows);

		if (rows.length == 0) {
			res.send(result);
			return ;	
		} else if (rows.length >= 0) {
			var r = rows[0];
			result.finishedEvents = r.count;
		}

		done();
	});

	//查询当前已完成的活动
	var curTotalActivitySql = 'SELECT count(1) count FROM activity_db.t_user_activity ua, t_activity a, t_user u '
		+ ' where str_to_date(?, "%Y-%m-%d") >= a.start_date '
		+ ' and str_to_date(?, "%Y-%m-%d")  <= a.end_date '
		+ ' and ua.user_id = u.id '
		+ ' and ua.activity_id = a.id '
		+ ' and u.account = ? ';

	connection.query(curTotalActivitySql, [curDate, curDate, req.query.account], function(err, rows, fields) {
		if (err) {
			res.send({success:false, errorMsg:'查询用户当天活动数据出错'});
			return ;
		}
		console.log(rows);

		if (rows.length == 0) {
			res.send(result);
			return ;	
		} else if (rows.length >= 0) {
			var r = rows[0];
			result.events = r.count;
		}

		done();
	});
}

