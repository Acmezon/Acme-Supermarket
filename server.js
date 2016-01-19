
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
app.post('/api/product/updateProductRating', api.Products.updateProductRating);
app.post('/api/product/userHasPurchased', api.Products.userHasPurchased);

app.get('/api/providesByProductId/:id', api.Provides.getProvidesByProductId);

app.get('/api/supplierName/:id', api.Supplier.getSupplierName);

app.get('/api/averageRatingByProductId/:id', api.Rates.getAverageRatingByProductId);

app.get('/api/provide/:id', api.Provides.getProvide);
app.get('/api/providesByProductId/:id', api.Provides.getProvidesByProductId);

app.get('/api/supplier/issupplier/:id', api.Supplier.isSupplier)
app.get('/api/supplierName/:id', api.Supplier.getSupplierName);

app.get('/api/averageReputationBySupplierId/:id', api.Reputation.getAverageReputationBySupplierId);

app.get('/api/averageRatingByProductId/:id', api.Rates.getAverageRatingByProductId);

app.post('/api/signup', api.Authentication.signup);
app.post('/api/signin', api.Authentication.authenticate);
app.get('/api/signout', api.Authentication.disconnect);
app.get('/api/getUserRole', api.Authentication.getUserRole);
app.get('/api/getPrincipal', api.Authentication.getPrincipal);

app.get('/api/myprofile', api.User.getMyProfile);
app.get('/api/mycreditcard', api.User.getMyCreditCard);
app.get('/api/creditcard/:id', api.CreditCard.getCreditCard);
app.post('/api/user/updateUser', api.User.updateUser);
app.post('/api/user/changePassword', api.User.changePassword);

app.get('/api/customers', api.Customer.getCustomers);
app.get('/api/customer/iscustomer/:email', api.Customer.isCustomer);
app.post('/api/customer/updateCC', api.Customer.updateCC);
app.post('/api/customer', api.Customer.updateCustomer);
app.delete('/api/customer/:id', api.Customer.deleteCustomer);

app.get('/api/admin/isadmin/:id', api.Admin.isAdmin);

app.get('/islogged', api.Authentication.isAuthenticated);

app.get('/api/resetDataset', api.Management.resetDataset);

app.get('/api/lang', api.i18n.getLanguageFile);

// redirect all others to the index (HTML5 history) Use in production only
app.get('*', routes.index);

/**
 * Start Server
 */

 http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
