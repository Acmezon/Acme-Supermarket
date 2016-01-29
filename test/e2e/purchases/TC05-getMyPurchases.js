describe('My purchases list', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an anonymous user get the /mypurchases list", function (){
		browser.get('http://localhost:3000/mypurchases');

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});

	it("should let a customer get the /mypurchases list", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchases');
		
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/mypurchases');
		expect(element.all(by.repeater('purchase in purchases')).count()).toBeGreaterThan(0);
	});

	it("shouldn't let a supplier get the /mypurchases list", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchases');
		
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("shouldn't let an admin get the /mypurchases list", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/mypurchases');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});
});