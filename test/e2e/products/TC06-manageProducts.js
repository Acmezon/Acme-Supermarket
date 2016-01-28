var path = require('path');

describe('Product management', function () {
	var product_name = '00 Prueba';

	beforeEach(function() {
		browser.get('http://localhost:3000/');
		element(by.css('[ng-click="signout()"]')).isPresent().then(function (result) {
			if(result) {
				element(by.css('[ng-click="signout()"]')).click()
			}
		});
	});

	it('should let the admin create a product', function (){		
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/products');
		
		element(by.css('a[href*="/products/create"]')).click();

		element(by.model('product.name')).sendKeys(product_name);
		element(by.model('product.description')).sendKeys('Prueba descripción');
		var fileToUpload = '../resources/images/img-thing.jpg',
		absolutePath = path.resolve(__dirname, fileToUpload);

		$('input[type="file"]').sendKeys(absolutePath);

		$('#createproduct-submit').click();

		browser.get('http://localhost:3000/products');
		element.all(by.repeater('product in products')).then(function (products) {
			var productName = products[0].element(by.className('title'));
			expect(productName.getText()).toEqual(product_name);
		});
	});
	it('should let the admin delete a product', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/products');

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
	it('shouldn\'t let a customer create a product', function() {
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/products');

		browser.get('http://localhost:3000/products/create');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/products/create');
	});
	it('shouldn\'t let a customer delete a product', function() {
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/products');

		browser.get('http://localhost:3000/products/create');

		element.all(by.repeater('product in products')).then(function (products) {
			expect(products[0].element(by.className('delete-product')).isPresent()).toBe(false);				
		});
	});
});