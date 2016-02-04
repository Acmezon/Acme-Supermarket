describe('Product details view', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't get the discounts of the product page due to not authenticated user", function (){
		browser.get('http://localhost:3000/products');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/products');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');

		expect(element(by.id('discounts')).isPresent()).toEqual(false);
	});

	it("shouldn't get the discounts of the product page due customer user", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/products');
		
		expect(element(by.id('discounts')).isPresent()).toEqual(false);
	});

	it("shouldn't get the discounts of the product page due supplier user", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/products');
		
		expect(element(by.id('discounts')).isPresent()).toEqual(false);
	});

	it("should get the discounts of the product page", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/products');
		
		expect(element(by.id('discounts')).isPresent()).toEqual(true);
	});

	
});