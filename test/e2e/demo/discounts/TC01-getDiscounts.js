describe('Discount management view', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it('should load the discounts', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/management/discounts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/management/discounts');
		browser.waitForAngular();

		expect(element.all(by.repeater('discount in $data')).count()).toBeGreaterThan(0);
	});

});