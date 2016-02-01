describe('My profile page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an anonymous user view its credit card", function() {
		browser.get('http://localhost:3000/myprofile');

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/myprofile');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});

	it("should let a customer view its credit card", function() {
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myprofile');

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/myprofile');

		expect(element(by.css('div#personalinfo')).isPresent()).toBe(true)
		expect(element(by.css('div#personalinfo>p:nth-child(4)')).getText()).toEqual('daniel.diaz@example.com')
		expect(element(by.id('ccdata-tab')).isPresent()).toBe(true);
		expect(element(by.id('ccdata')).isPresent()).toBe(true);
	});

});