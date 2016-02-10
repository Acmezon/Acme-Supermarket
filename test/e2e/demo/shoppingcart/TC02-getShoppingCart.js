describe('Get the shopping cart', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});
	
	it('Should view the shopping cart table', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/products');
		element(by.cssContainingText('option', 'Price')).click();
		element(by.css('img.v-middle')).click()

		var product = element.all(by.css('.product')).first();
		product.click();

		browser.sleep(2000)
		// Add 3 products
		var cartbtn = element.all(by.id('cart-btn')).first();
		cartbtn.click();
		cartbtn.click();
		cartbtn.click();

		// Test cookie
		browser.manage().getCookie('shoppingcart').then(function(cookieValue) {
			var error = !cookieValue || (cookieValue && cookieValue.value==="{}")
			expect(error).toEqual(false);
		});

		// Test table
		browser.get('http://localhost:3000/shoppingcart');
		expect(element.all(by.repeater('product in shoppingcart')).count()).toEqual(1);
		expect(element(by.model('product.quantity')).getAttribute('value')).toEqual('3');

		// Test quantity buttons
		var downbtn = element(by.css('.input-number-decrement'));
		var upbtn = element(by.css('.input-number-increment'));
		downbtn.click();
		expect(element(by.model('product.quantity')).getAttribute('value')).toEqual('2');
		upbtn.click();
		expect(element(by.model('product.quantity')).getAttribute('value')).toEqual('3');

	});
});