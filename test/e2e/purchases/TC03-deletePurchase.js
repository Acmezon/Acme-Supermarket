describe('Purchases list', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("should let an admin delete a purchase from the /purchases list", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/purchases');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/purchases');

		expect(element.all(by.repeater('purchase in purchases')).count()).toEqual(20);

		element.all(by.repeater('purchase in purchases')).first().element(by.css('td>button.btn-danger')).click();

		expect(element.all(by.repeater('purchase in purchases')).count()).toEqual(19);


	});
});