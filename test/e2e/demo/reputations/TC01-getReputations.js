describe('Reputation rating section from /product page', function () {
	
	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});
	
	it("should let a supplier get his reputations", function (){
		// Sign in
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myproducts');
		
		element.all(by.repeater('product in products')).first().element(by.css('a.product')).click();

		browser.waitForAngular();

		expect(element(by.id('reputations')).isPresent()).toEqual(true);
	});

});