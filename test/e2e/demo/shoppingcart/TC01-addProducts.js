describe('Add products to the shopping cart', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
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