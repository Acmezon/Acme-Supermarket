
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./routes/routes'),
  products_api = require('./routes/products_api'),
  http = require('http'),
  path = require('path');
  
var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname+"/public"));

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

app.get('/api/resetDataset', products_api.resetDataset);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
