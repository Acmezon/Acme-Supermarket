
/**
* Module dependencies
*/



var express = require('express'),
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		errorhandler = require('errorhandler'),
		morgan = require('morgan'),
		routes = require('./routes/routes'),
		http = require('http'),
		path = require('path'),
		db_utils = require('./routes/db_utils'),
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
db_utils.connect();

var api = require('./routes/api');

/**
 * Routes
 */
// serve index and view partials
app.get('/', routes.index);
app.get('/home', routes.index);




/* JSON API */

// Products
app.get('/api/products', api.Products.getAllProducts);
app.get('/api/products/limit/:limit', api.Products.getAllProductsLimit)
app.get('/api/product/:id', api.Products.getProduct);
app.post('/api/product/updateProduct', api.Products.updateProduct);
app.post('/api/product/updateProductImage', api.Products.updateProductImage);
app.post('/api/product/updateProductRating', api.Products.updateProductRating);
app.post('/api/product/userHasPurchased', api.Products.userHasPurchased);

// Rates
app.get('/api/averageRatingByProductId/:id', api.Rates.getAverageRatingByProductId);

// Provides
app.get('/api/provide/:id', api.Provides.getProvide);
app.get('/api/providesByProductId/:id', api.Provides.getProvidesByProductId);

// Purchases
app.get('/api/purchase/:id', api.Purchases.getPurchase);
app.get('/api/purchase/process/:billingMethod', api.Purchases.purchase);
app.get('/api/purchases/bycustomer/:id', api.Purchases.getPurchasesByCustomerId);

// Purchase lines
app.get('/api/purchaselines/bypurchase/:id', api.PurchaseLines.getPurchaseLinesByPurchaseId);

// Suppliers
app.get('/api/supplierName/:id', api.Supplier.getSupplierName);

// Reputations
app.get('/api/averageReputationBySupplierId/:id', api.Reputation.getAverageReputationBySupplierId);

// Authentication
app.post('/api/signup', api.Authentication.signup);
app.post('/api/signin', api.Authentication.authenticate);
app.get('/api/signout', api.Authentication.disconnect);
app.get('/api/getUserRole', api.Authentication.getUserRole);
app.get('/islogged', api.Authentication.isAuthenticated);

// Users
app.get('/api/myprofile', api.User.getMyProfile);
app.post('/api/user/updateUser', api.User.updateUser);
app.post('/api/user/changePassword', api.User.changePassword);

// Customers
app.get('/api/customers', api.Customer.getCustomers);
app.post('/api/customer/updateCC', api.Customer.updateCC);
app.post('/api/customer', api.Customer.updateCustomer);
app.delete('/api/customer/:id', api.Customer.deleteCustomer);
app.get('/api/mycreditcard', api.Customer.getMyCreditCard);
app.get('/api/myRecommendations', api.Customer.getMyRecommendations);

// Admins

// Credit cards
app.get('/api/creditcard/:id', api.CreditCard.getCreditCard);

// Management
app.get('/api/resetDataset', api.Management.resetDataset);
app.get('/api/loadBigDataset', api.Management.loadBigDataset);

// i18n
app.get('/api/lang', api.i18n.getLanguageFile);

//Social media service
app.get('/api/socialMedia/status', api.SocialMedia.isTwitterScrapperRunning);
app.get('/api/socialMedia/start', api.SocialMedia.launchTwitterScrapper);
app.get('/api/socialMedia/stop', api.SocialMedia.stopTwitterScrapper);

// redirect all others to the index (HTML5 history) Use in production only
app.get('*', routes.index);

/**
 * Start Server
 */

 http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
