var path = require('path');

describe('Product delete', function () {
	var product_name = '00 Prueba';

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});


	it('should let the admin delete a product', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/products');

		element.all(by.repeater('product in products')).then(function (products) {
			products[0].element(by.className('delete-product')).click();
			browser.get('http://localhost:3000/products');
			element.all(by.repeater('product in products')).then(function (products) {
				var productName = products[0].element(by.className('title'));
				expect(productName.getText()).not.toEqual(product_name);
			});
		});
	});
	
	it('shouldn\'t let a customer delete a product', function() {
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/products');

		element.all(by.repeater('product in products')).then(function (products) {
			expect(products[0].element(by.className('delete-product')).isPresent()).toBe(false);				
		});
	});

	it('shouldn\'t let a supplier delete a product', function() {
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/products');

		element.all(by.repeater('product in products')).then(function (products) {
			expect(products[0].element(by.className('delete-product')).isPresent()).toBe(false);				
		});
	});

	it('shouldn\'t let an anonymous user delete a product', function() {
		browser.get('http://localhost:3000/products');

		element.all(by.repeater('product in products')).then(function (products) {
			expect(products[0].element(by.className('delete-product')).isPresent()).toBe(false);				
		});
	});
});