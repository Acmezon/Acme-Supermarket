describe('Rating management view', function () {
	
	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an user rate for other due to non authenticated", function (){
		browser.get('http://localhost:3000/management/rating');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});
	
	it("shouldn't let an user rate for other due to principal customer", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/management/rating');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("shouldn't let an user rate for other due to principal supplier", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/management/rating');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("should let an admin rate for other customer", function () {

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('belen.carrasco@example.com');
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

		element(by.css('div.product-row.row')).getAttribute('id').then (function (product_id) {
			product_id = parseInt(product_id);

			browser.manage().deleteAllCookies();

			browser.get('http://localhost:3000/signin');

			element(by.model('email')).sendKeys('admin@mail.com');
			element(by.model('password')).sendKeys('administrator');

			element(by.css('.button')).click();

			browser.get('http://localhost:3000/management/rating');
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/management/rating');

			expect(element(by.css('button#submit')).isEnabled()).toEqual(false);

			element(by.css('input#email')).sendKeys('belen.carrasco@example.com');
			expect(element(by.css('button#submit')).isEnabled()).toEqual(false);

			element(by.css('input#product_id')).sendKeys(product_id);
			expect(element(by.css('button#submit')).isEnabled()).toEqual(false);

			element(by.css('input#value')).sendKeys(5);
			expect(element(by.css('button#submit')).isEnabled()).toEqual(true);

			element(by.css('button#submit')).click();
			browser.waitForAngular();

			expect(element(by.css('div.alert.alert-success')).isPresent()).toEqual(true);

		})

	});

});