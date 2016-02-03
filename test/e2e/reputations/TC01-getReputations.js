describe('Reputation rating section from /product page', function () {
	
	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let a not authenticated user get his reputations", function (){
		browser.get('http://localhost:3000/myproducts');

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});

	it("shouldn't let an admin get his reputations", function (){
		// Sign in
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myproducts');

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');

		browser.get('http://localhost:3000/products');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		expect(element(by.id('reputations')).isPresent()).toEqual(false);
	});

	it("shouldn't let a customer get his reputations", function (){
		// Sign in
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myproducts');

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');

		browser.get('http://localhost:3000/products');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		expect(element(by.id('reputations')).isPresent()).toEqual(false);
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