describe('Checkout page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("should let a customer redeem a discount code for its purchase", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/product/1');

		var discounts_applied = element.all(by.repeater('discount in tableParams2.data track by discount._id'))
		discounts_applied.count().then (function (number) {
			if (number > 0) {
				discounts_applied.first().element(by.css('tr>td:nth-child(1)')).getText().then (function (code) {
					browser.manage().deleteAllCookies();

					browser.get('http://localhost:3000/signin');

					element(by.model('email')).sendKeys('belen.carrasco@example.com');
					element(by.model('password')).sendKeys('customer');

					element(by.css('.button')).click();

					// Visit product
					// Visit product
					browser.get('http://localhost:3000/product/1');

					// Add to shopping cart
					var cartbtn = element.all(by.id('cart-btn')).first();
					expect(cartbtn.isPresent()).toBe(true);
					cartbtn.click();
					cartbtn.click();
					cartbtn.click();

					// Shopping cart view page
					browser.get('http://localhost:3000/shoppingcart');

					// Purchase view page
					element(by.css('button.btn-arrow-right')).click()

					expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/checkout');
					expect(element.all(by.repeater('product in shoppingcart')).count()).toBeGreaterThan(0);

					var cell = element.all(by.repeater('product in shoppingcart')).first().element(by.css('tr>td:nth-child(5)'));
					cell.getText().then (function (old_text) {

						var input = element(by.css('input.form-control'));
						input.sendKeys(code);
						var btn = element(by.css('span.input-group-btn>button'));
						btn.click();
						browser.waitForAngular();

						expect(btn.isEnabled()).toEqual(false);
						cell.getText().then (function (new_text) {
							expect(new_text).not.toEqual(old_text);
						})
					});
				});
			}
		});

	});
});