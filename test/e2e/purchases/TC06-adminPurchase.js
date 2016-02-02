describe('Purchase creation', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an not authenticated user create admin purchase", function (){
		browser.get('http://localhost:3000/purchase/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});

	it("shouldn't let a supplier create admin purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/purchase/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("shouldn't let a customer create admin purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/purchase/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("shouldn't let an admin create admin purchase due to empty customer email", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/purchase/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchase/create');

		element(by.css('input#product_id')).clear().then(function () {

			// Billing method
			element.all(by.css('div.list-group>a')).first().click();

		
			// Search a product
			element(by.css('input#product_id')).sendKeys('50');
			element(by.css('button#add')).click();
			browser.waitForAngular();

			// Add product
			expect(element.all(by.repeater('provide in provides')).count()).toBeGreaterThan(0);
			element.all(by.repeater('provide in provides')).first().element(by.css('input#cart-btn')).click();
			browser.waitForAngular();
			// Shopping cart updates
			expect(element.all(by.repeater('product in shoppingcart')).count()).toBe(1);

			// Submit
			expect(element(by.css('button#submit')).isEnabled()).toBe(false);

		});
		
	});

	it("shouldn't let an admin create admin purchase due to billing method not selected", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/purchase/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchase/create');

		element(by.css('input#product_id')).clear().then(function () {
			// Customer email
			element(by.model('customerEmail')).sendKeys('belen.carrasco@example.com')
			element(by.css('button.check')).click();
			browser.waitForAngular();
			expect(element(by.css('div.alert')).isPresent()).toBe(true);
		
			// Search a product
			element(by.css('input#product_id')).sendKeys('50');
			element(by.css('button#add')).click();
			browser.waitForAngular();

			// Add product
			expect(element.all(by.repeater('provide in provides')).count()).toBeGreaterThan(0);
			element.all(by.repeater('provide in provides')).first().element(by.css('input#cart-btn')).click();
			browser.waitForAngular();
			// Shopping cart updates
			expect(element.all(by.repeater('product in shoppingcart')).count()).toBe(1);

			// Submit
			expect(element(by.css('button#submit')).isEnabled()).toBe(false);
		});
	});

	it("shouldn't let an admin create admin purchase due to empty shopping cart", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/purchase/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchase/create');

		element(by.css('input#product_id')).clear().then(function () {
			// Customer email
			element(by.model('customerEmail')).sendKeys('belen.carrasco@example.com')
			element(by.css('button.check')).click();
			browser.waitForAngular();
			expect(element(by.css('div.alert')).isPresent()).toBe(true);

			// Billing method
			element.all(by.css('div.list-group>a')).first().click();

			// Submit
			expect(element(by.css('button#submit')).isEnabled()).toBe(false);
		});
	});

	it("should let an admin create admin purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/purchase/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchase/create');

		element(by.css('input#product_id')).clear().then(function () {
			// Customer email
			element(by.model('customerEmail')).sendKeys('belen.carrasco@example.com')
			element(by.css('button.check')).click();
			browser.waitForAngular();
			expect(element(by.css('div.alert')).isPresent()).toBe(true);

			// Billing method
			element.all(by.css('div.list-group>a')).first().click();

		
			// Search a product
			element(by.css('input#product_id')).sendKeys('50');
			element(by.css('button#add')).click();
			browser.waitForAngular();

			// Add product
			expect(element.all(by.repeater('provide in provides')).count()).toBeGreaterThan(0);
			element.all(by.repeater('provide in provides')).first().element(by.css('input#cart-btn')).click();
			browser.waitForAngular();
			// Shopping cart updates
			expect(element.all(by.repeater('product in shoppingcart')).count()).toBe(1);

			// Submit
			element(by.css('button#submit')).click();

			browser.getLocationAbsUrl().then(function (url) {
				expect(url).toMatch('/checkout/success');
			});	
		});
	});
});