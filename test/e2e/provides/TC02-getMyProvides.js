describe('My product list page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an anonymous user get the /myproducts list", function (){
		browser.get('http://localhost:3000/myproducts');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/myproducts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	it("shouldn't let customer get the /myproducts list", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myproducts');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/myproducts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	it("shouldn't let admin get the /myproducts list", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myproducts');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/myproducts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	it("should let supplier get the /myproducts list", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myproducts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/myproducts');
		browser.waitForAngular();

		var product_links = element.all(by.repeater('product in products'));
		expect(product_links.count()).toEqual(9);
	});
});