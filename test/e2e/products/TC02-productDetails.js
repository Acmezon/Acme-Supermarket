describe('Load products', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("Shouldn't get a product from the /products list due to non authenticated user", function (){
		browser.get('http://localhost:3000/products');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/products');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});

	it("Shouldn't get a product from the /home list due to non authenticated user", function (){
		browser.get('http://localhost:3000/');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});

	it("Should get a product from the /home list", function (){

		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/');
		
		// Save visited product id
		var product = element.all(by.repeater('product in products')).first();
		var expectedURL;
		product.getAttribute('id').then(function (id) {
			expectedURL = 'http://localhost:3000/product/' + id;

			//AFTER THIS
			// Visit product
			element.all(by.css('div.top-box>div>div>a>div')).first().click();

			browser.waitForAngular();

			// Expect not being in the same site
			expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/');
			// Redirecting... Expect being in signin page
			expect(browser.getCurrentUrl()).toEqual(expectedURL);
		});
		
	});

	it("Should get a product from the /products list", function (){

		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/products');
		
		// Save visited product id
		var product = element.all(by.repeater('product in products')).first();
		var expectedURL;
		product.getAttribute('id').then(function (id) {
			expectedURL = 'http://localhost:3000/product/' + id;

			//AFTER THIS
			// Visit product
			element.all(by.css('div.top-box>div>div>a>div')).first().click();;

			browser.waitForAngular();

			// Expect not being in the same site
			expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/');
			// Redirecting... Expect being in signin page
			expect(browser.getCurrentUrl()).toEqual(expectedURL);
		});
		
	});

});