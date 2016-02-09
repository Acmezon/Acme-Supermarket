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

		expect(element.all(by.repeater('product in products')).first().element(by.id('delete-product')).isPresent()).toEqual(true);
		element.all(by.repeater('product in products')).first().element(by.id('delete-product')).click();

		browser.get('http://localhost:3000/products');

		element.all(by.repeater('product in products')).first().element(by.css('.title')).getText().then (function (text) {
			expect(text).not.toEqual(product_name)
		});
	});

	it('shouldn\'t let an anonymous user delete a product', function() {
		browser.get('http://localhost:3000/products');

		expect(element.all(by.repeater('product in products')).first().element(by.id('delete-product')).isPresent()).toEqual(false);
	});
});