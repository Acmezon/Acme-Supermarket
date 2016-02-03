var path = require('path');

describe('Product creation', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let a customer create a product", function() {
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/products/create');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/products/create');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	it("shouldn't let a supplier create a product", function() {
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/products/create');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/products/create');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	it("shouldn't let an anonymous user create a product", function() {	
		browser.get('http://localhost:3000/products/create');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/products/create');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/401');
	});

	it('should let the admin create a product', function (){		
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/products');
		
		element(by.css('a.add-product')).click();

		var product_name = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
		element(by.model('product.name')).sendKeys(product_name);
		element(by.model('product.description')).sendKeys('Prueba descripción');
		var fileToUpload = '../../resources/images/img-thing.jpg',
		absolutePath = path.resolve(__dirname, fileToUpload);

		$('form#submit-form>div:nth-child(3)>input[type="file"]').sendKeys(absolutePath);

		$('button#createproduct-submit').click();

		browser.get('http://localhost:3000/products');
		browser.waitForAngular();

		//TODO vista de productos no disponibles

		// Inverse order
		element(by.css('img.v-middle')).click()
		browser.waitForAngular();

		element.all(by.repeater('product in products')).then(function (products) {
			var productName = products[0].element(by.className('title'));
			expect(productName.getText()).toEqual(product_name);
		});
	});

})