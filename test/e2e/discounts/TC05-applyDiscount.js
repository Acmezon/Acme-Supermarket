describe('Product details view', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("should apply a discount to a product", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/products');
		
		expect(element(by.id('discounts')).isPresent()).toEqual(true);

		var list_no = element.all(by.repeater('discount in tableParams.data track by discount._id'));
		var list_yes = element.all(by.repeater('discount in tableParams2.data track by discount._id'));


		element(by.css('table#table-available-discounts>caption>span')).getText().then (function (discounts_no_old_number) {
			element(by.css('table#table-applied-discounts>caption>span')).getText().then (function (discounts_yes_old_number) {
				discounts_no_old_number = parseInt(discounts_no_old_number);
				discounts_yes_old_number = parseInt(discounts_yes_old_number);

				var addbtn = list_no.first().element(by.css('button.btn-success'));
				addbtn.click();
				browser.waitForAngular();

				element(by.css('table#table-available-discounts>caption>span')).getText().then (function (discounts_no_new_number) {
					element(by.css('table#table-applied-discounts>caption>span')).getText().then (function (discounts_yes_new_number) {
						discounts_no_new_number = parseInt(discounts_no_new_number);
						discounts_yes_new_number = parseInt(discounts_yes_new_number);

						// Expect discount not applied has decremented
						expect(discounts_no_new_number).toEqual(discounts_no_old_number-1);

						// Expect discounts applied has incremented
						expect(discounts_yes_new_number).toEqual(discounts_yes_old_number+1)
					});
				});

			});
		});
	});

	it("should clear a discount of a product", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/');
		
		element.all(by.css('div.top-box>div>div>a>div')).first().click();

		browser.waitForAngular();

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/products');
		
		expect(element(by.id('discounts')).isPresent()).toEqual(true);

		var list_no = element.all(by.repeater('discount in tableParams.data track by discount._id'));
		var list_yes = element.all(by.repeater('discount in tableParams2.data track by discount._id'));


		element(by.css('table#table-available-discounts>caption>span')).getText().then (function (discounts_no_old_number) {
			element(by.css('table#table-applied-discounts>caption>span')).getText().then (function (discounts_yes_old_number) {
				discounts_no_old_number = parseInt(discounts_no_old_number);
				discounts_yes_old_number = parseInt(discounts_yes_old_number);

				var clearbtn = list_yes.first().element(by.css('button.btn-danger'));
				clearbtn.click();
				browser.waitForAngular();

				element(by.css('table#table-available-discounts>caption>span')).getText().then (function (discounts_no_new_number) {
					element(by.css('table#table-applied-discounts>caption>span')).getText().then (function (discounts_yes_new_number) {
						discounts_no_new_number = parseInt(discounts_no_new_number);
						discounts_yes_new_number = parseInt(discounts_yes_new_number);

						// Expect discount not applied has incremented
						expect(discounts_no_new_number).toEqual(discounts_no_old_number+1);

						// Expect discounts applied has decremented
						expect(discounts_yes_new_number).toEqual(discounts_yes_old_number-1)
					});
				});

			});
		});
	});

});