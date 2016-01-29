describe('System\'s customers management view', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't load the customers to a not authenticated used", function (){
		browser.get('http://localhost:3000/customers');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/401');

		expect(element(by.id('customers-length')).isPresent()).toBe(false)
	});

	it("shouldn't load the customers to a customer", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/customers');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');

		expect(element(by.id('customers-length')).isPresent()).toBe(false)
	});


	it("shouldn't load the customers to a supplier", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/customers');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');

		expect(element(by.id('customers-length')).isPresent()).toBe(false)
	});


	it('should load the customers', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/customers');

		element(by.id('customers-length')).getText().then (function (text) {
			var number_customers = parseInt(text);
			expect(number_customers).toBeGreaterThan(0);
		});
	});

});