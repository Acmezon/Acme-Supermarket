var express = require('express'),
	bodyParser = require('body-parser'),
	http = require('http'),
	path = require('path'),
	db_utils = require('./routes/db_utils');

var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3030);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database connection
db_utils.connect();

var api = require('./routes/api');

/* JSON API */
app.get('/api/recommendations/:userId', api.getRecommendations);
app.get('/api/recommend/:userId', api.recommend)
app.get('/api/updateParameters/:userId', api.updateParameters);
app.post('/api/storePurchase', api.storePurchase)

// redirect all others to the index (HTML5 history) Use in production only
app.get('*', api.notFound);


/**
 * Start Server
 */

 http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
