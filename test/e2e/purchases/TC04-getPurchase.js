describe('Purchases list', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an anonymous user get a purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/purchases');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchases');

		element.all(by.repeater('purchase in purchases')).first().getAttribute('id').then(function (id) {
			// Getted a purchase id. Now logout and access
			browser.manage().deleteAllCookies();

			browser.get('http://localhost:3000/purchase/'+id);
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
		});
	});

	it("shouldn't let a customer get 'notmine' purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/mypurchases');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/mypurchases');

		element.all(by.repeater('purchase in purchases')).first().getAttribute('id').then(function (id) {
			// Getted a purchase id. Now logout and access
			browser.manage().deleteAllCookies();

			browser.get('http://localhost:3000/signin');

			element(by.model('email')).sendKeys('sergio.gomez@example.com');
			element(by.model('password')).sendKeys('customer');

			element(by.css('.button')).click();

			browser.get('http://localhost:3000/purchase/'+id);
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
		});
	});

	it("should let customers get their purchases", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/mypurchases');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/mypurchases');

		element.all(by.repeater('purchase in purchases')).first().getAttribute('id').then(function (id) {

			browser.get('http://localhost:3000/purchase/'+id);
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchase/'+id);

			expect(element.all(by.repeater('purchaseline in purchase_list')).count()).toBeGreaterThan(0)
		});
	});

	it("should let admin get a purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/purchases');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchases');

		element.all(by.repeater('purchase in purchases')).first().getAttribute('id').then(function (id) {

			browser.get('http://localhost:3000/purchase/'+id);
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchase/'+id);

			expect(element.all(by.repeater('purchaseline in purchase_list')).count()).toBeGreaterThan(0)
		});
	});
});