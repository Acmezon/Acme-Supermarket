describe('Add products to the shopping cart', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("Shouldn't show add to cart button due to user is an admin", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit prodduct
		browser.get('http://localhost:3000/products');
		var product = element.all(by.css('.product')).first();
		product.click();

		// Expect cart button not appearing
		var cartbtn = element(by.id('cart-btn'));
		expect(cartbtn.isPresent()).toBe(false);
	});

	it("Shouldn't show add to cart button due to user is a supplier", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/products');
		var product = element.all(by.css('.product')).first();
		product.click();

		// Expect cart button not appearing
		var cartbtn = element(by.id('cart-btn'));
		expect(cartbtn.isPresent()).toBe(false);

	});

	it("Should create cookie and store products in it", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/products');
		element(by.cssContainingText('option', 'Price')).click();
		element(by.css('img.v-middle')).click()
		
		var product = element.all(by.css('.product')).first();
		product.click();

		browser.sleep(2000)
		var cartbtn = element.all(by.id('cart-btn')).first();
		expect(cartbtn.isPresent()).toBe(true);
		cartbtn.click();
		cartbtn.click();
		cartbtn.click();

		var spanp = element(by.id('products-cart'));
		expect(spanp.getText()).toEqual('3');

	});
});