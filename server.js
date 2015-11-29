
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

//Database connection
api.db_connection.connect();

/**
 * Routes
 */

var router_customer = express.Router();

var router_admin = express.Router();

var router_private_function = function(req, res, next) {
	console.log("Private");
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;  
				next();
			}
		});

	} else {
		// if there is no token
		// return an error

		/*
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		*/
		res.send(403);
		//next();
	}
};

router_customer.use(router_private_function);
router_admin.use(router_private_function);

// serve index and view partials
app.get('/', routes.index);
app.get('/home', routes.index);

// JSON API

app.get('/api/products', api.Products.getAllProducts);
app.get('/api/getCustomer', api.Customer.getCustomer);


app.get('/api/resetDataset', api.Management.resetDataset);//TODO Should not be public in the final version


app.post('/api/signup', api.Authentication.signup);
app.post('/api/signin', api.Authentication.authenticate);

router_customer.get('/:route', routes.index);
router_admin.get('/:route', routes.index);

app.use('/customer', router_customer);
app.use('/admin', router_admin);

// redirect all others to the index (HTML5 history) Use in production only
app.get('*', routes.index);

/**
 * Start Server
 */

 http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
