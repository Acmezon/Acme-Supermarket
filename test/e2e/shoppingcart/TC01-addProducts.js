describe('Add products to the shopping cart', function () {
	it('Should create cookie and store products in it', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.manage().deleteCookie("shoppingcart");

		browser.get('http://localhost:3000/products');
		var product = element.all(by.css('.product')).first();
		product.click();

		var cartbtn = element(by.id('cart-btn'));
		cartbtn.click();
		cartbtn.click();
		cartbtn.click();

		var spanp = element(by.id('products-cart'));
		expect(spanp.getText()).toEqual('3');

	});
});