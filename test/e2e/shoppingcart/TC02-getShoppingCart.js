describe('Get the shopping cart', function () {
	it('Should view the shopping cart table', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.manage().deleteCookie("shoppingcart");

		browser.get('http://localhost:3000/products');
		var product = element.all(by.css('.product')).first();
		product.click();

		// Add 3 products
		var cartbtn = element(by.id('cart-btn'));
		cartbtn.click();
		cartbtn.click();
		cartbtn.click();

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