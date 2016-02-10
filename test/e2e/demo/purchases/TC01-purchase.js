describe('Checkout page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an anonymous user purchase", function (){
		browser.get('http://localhost:3000/checkout');

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});

	it("shouldn't let an admin purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/checkout');
		
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("shouldn't let a supplier purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/checkout');
		
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("should let a customer purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('sergio.gomez@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/products');
		element(by.css('img.v-middle')).click()
		element(by.cssContainingText('option', 'Price')).click();

		browser.sleep(2000)
		var product = element.all(by.css('.product')).first();
		product.click();
		browser.sleep(2000)

		// Add to shopping cart
		var cartbtn = element.all(by.id('cart-btn')).first();
		expect(cartbtn.isPresent()).toBe(true);
		cartbtn.click();
		cartbtn.click();
		cartbtn.click();
		browser.sleep(2000)

		// Shopping cart view page
		browser.get('http://localhost:3000/shoppingcart');

		// Purchase view page
		element(by.css('button.btn-arrow-right')).click()

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/checkout');
		browser.sleep(2000)
		expect(element.all(by.repeater('product in shoppingcart')).count()).toBeGreaterThan(0);

		// Select delivery period
		element.all(by.css('div.list-group>a')).first().click();
		
		// Purchase
		browser.sleep(2000)
		element(by.css('button.btn-arrow-right')).click();

		browser.sleep(3000)
		browser.getCurrentUrl().then( function (url) {
			expect(url.indexOf('success')).toBeGreaterThan(-1)
		});
	});
});