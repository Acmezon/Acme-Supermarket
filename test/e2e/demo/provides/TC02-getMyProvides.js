describe('My product list page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
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