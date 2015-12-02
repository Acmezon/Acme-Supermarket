var Customer = require('./customers_api'),
	Products = require('./products_api'),
	Authentication = require('./authentication'),
	Management = require('./management'),
	db_utils = require('./db_utils'),
	i18n = require('./i18n');

exports.Customer = Customer;
exports.Products = Products;
exports.Authentication = Authentication;
exports.Management = Management;
exports.db_utils = db_utils;
exports.i18n = i18n;