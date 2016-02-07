describe('Product rating and Provide rating', function () {
	
	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an user rate due to non authenticated", function (){
		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		var ratingElement = element(by.model('product_rating'));
		expect(ratingElement.isPresent()).toBe(false);
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});
	
	it("shouldn't let an user rate due not a customer", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		var ratingElement = element(by.model('product_rating'));
		expect(ratingElement.isPresent()).toBe(false);

		var supplierRElement = element(by.model('provide.reputation'));
		expect(ratingElement.isPresent()).toBe(false);
	});

	it("should let an user rate.", function () {

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.sleep(1000);

		// Visit purchase
		browser.get('http://localhost:3000/mypurchases');

		// Expect not redirected
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/401');

		element.all(by.repeater('purchase in purchases')).last().element(by.model('purchase._id')).click();
		browser.waitForAngular();

		// Visit product
		element.all(by.repeater('purchaseline in purchase_list')).last().element(by.model('purchaseline.product._id')).click();
		browser.waitForAngular();

		var ratingElement = element(by.model('product_rating'));
		expect(ratingElement.isPresent()).toBe(true);

		var supplierRElement = element(by.model('provide.reputation'));
		expect(ratingElement.isPresent()).toBe(true);
	});

});