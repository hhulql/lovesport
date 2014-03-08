
/**
 * Module dependencies.
 */
var utils = require('./db');
mapping = function(handler) {
 	return function(req, res) {
 		pool.getConnection(function(err, connection){
		if (err) {
			res.send(err);
			return ;
		}
		//connection 数据库连接对象
		//req.query 从url传递过来的参数对象
		//res 请求的相应对象，用于向浏览器返回数据
		handler(connection, req, res);
	});
 	};
 };

var express = require('express')
  , routes = require('./routes/index')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
//用户相关接口
app.get('/UserLogin', user.UserLogin);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});