var express = require('express'),
	bodyParser = require('body-parser'),
	http = require('http'),
	path = require('path'),
	db_utils = require('./routes/db_utils');

var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3040);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database connection
db_utils.connect();

//Automatic purchases and similarity
var scheduledTasks = require('./routes/scheduled_tasks');
scheduledTasks.scheduleSentimentAnalysis();

var ListenerService = require('./routes/services/service_twitter_listener');
// ListenerService.start_twitter_listener()

var api = require('./routes/api');

/* JSON API */
app.get('/api/listener/start', api.ListenerApi.start_twitter_listener);
app.get('/api/listener/stop', api.ListenerApi.stop_twitter_listener);
app.get('/api/listener/status', api.ListenerApi.is_listener_alive);

app.get('/api/forceSentimentAnalysis', api.ListenerApi.force_sentiment_analysis);

app.get('/api/getAnalysis', api.getAnalysis)

// redirect all others to the index (HTML5 history) Use in production only
app.get('*', api.notFound);


/**
 * Start Server
 */

 http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
