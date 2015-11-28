var Customer = require('./customers_api'),
	Products = require('./products_api'),
	Authentication = require('./authentication'),
	db_connection = require('./db_connection');

exports.Customer = Customer;
exports.Products = Products;
exports.Authentication = Authentication;

exports.db_connection = db_connection;