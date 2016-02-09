describe('Social media monitoring rules page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("Shouldn't show the monitoring rules to a not authenticated user", function (){
		browser.get('http://localhost:3000/monitoringrules');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401')
	});

	it("Shouldn't show the monitoring rules to a supplier", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/monitoringrules');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("Shouldn't show the monitoring rules to a customer", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('sergio.gomez@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/monitoringrules');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("Should show the monitoring rules to an admin", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/monitoringrules');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/monitoringrules');

		var elements = element.all(by.repeater('socialmediarule in group.data'));
		expect(elements.count()).toBeGreaterThan(0);

		element(by.css('span#rules-length')).getText().then (function (number) {
			number = parseInt(number);
			expect(number).toBeGreaterThan(0);
		});
	});
});