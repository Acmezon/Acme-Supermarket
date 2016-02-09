describe('Purchases list', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("should let an admin delete a purchase from the /purchases list", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.purchases@mail.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myprofile');

		var id = element(by.css('span#id'));

		id.getText().then(function (text) {
			var customer_id = parseInt(text);

			// Logout
			browser.manage().deleteAllCookies();

			browser.get('http://localhost:3000/signin');

			element(by.model('email')).sendKeys('admin@mail.com');
			element(by.model('password')).sendKeys('administrator');

			element(by.css('.button')).click();

			// Visit product
			browser.get('http://localhost:3000/purchases');
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchases');

			browser.waitForAngular();
			$('#filterHeading a').click();

			browser.wait(function() {
				return element(by.model('customerFilter')).isDisplayed();
			}, 3000);

			element(by.model('customerFilter')).sendKeys(customer_id);
			element(by.css('[ng-click="filter(customerFilter)"]')).click();

			browser.waitForAngular();

			expect(element.all(by.repeater('purchase in purchases')).count()).toEqual(1);

			element.all(by.repeater('purchase in purchases')).first().element(by.css('td>button.btn-danger')).click();

			expect(element.all(by.repeater('purchase in purchases')).count()).toEqual(0);
		});
	});
});