
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./routes/routes'),
  db_connection = require('./routes/db_connection'),
  products_api = require('./routes/products_api'),
  customers_api = require('./routes/customers_api'),
  authentication = require('./routes/authentication')
  http = require('http'),
  path = require('path'),
  config = require('./config');
  
var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname+"/public"));

app.set('superSecret', config.secret);

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorhandler());
}

// production only
if (env === 'production') {
  // TODO
}

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/views/:name', routes.views);

// JSON API
app.get('/api/products', products_api.getAllProducts);

app.get('/api/users', function(req, res) {
  res.json({users : 'users'});
});

app.get('/api/resetDataset', db_connection.resetDataset);

app.post('/signup', authentication.signup);
app.post('/signin', authentication.authenticate);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
