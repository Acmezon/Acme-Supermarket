
/**
* Module dependencies
*/

var express = require('express'),
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		errorhandler = require('errorhandler'),
		morgan = require('morgan'),
		routes = require('./routes/routes'),
		api = require('./routes/api'),
		http = require('http'),
		path = require('path'),
		config = require('./config'),
		cookieParser = require('cookie-parser');

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
app.use(cookieParser());

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

//Database connection
api.db_utils.connect();

/**
 * Routes
 */
// serve index and view partials
app.get('/', routes.index);
app.get('/home', routes.index);

// JSON API
app.get('/api/products', api.Products.getAllProducts);
app.get('/api/product/:id', api.Products.getProduct);
app.post('/api/product/updateProduct', api.Products.updateProduct);
app.post('/api/product/updateProductImage', api.Products.updateProductImage);
app.post('/api/product/updateProductRating', api.Products.updateProductRating)

app.post('/api/signup', api.Authentication.signup);
app.post('/api/signin', api.Authentication.authenticate);
app.get('/api/signout', api.Authentication.disconnect);
app.get('/api/getUserRole', api.Authentication.getUserRole);
app.get('/api/getPrincipal', api.Authentication.getPrincipal);

app.get('/islogged', api.Authentication.isAuthenticated)

app.get('/api/resetDataset', api.Management.resetDataset);

app.get('/api/lang', api.i18n.getLanguageFile)

// redirect all others to the index (HTML5 history) Use in production only
app.get('*', routes.index);

/**
 * Start Server
 */

 http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
