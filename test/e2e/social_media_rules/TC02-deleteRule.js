describe('Social media monitoring rules page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("Should let the admin delete a rule", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/monitoringrules');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/monitoringrules');

		var elements = element.all(by.repeater('socialmediarule in group.data'));
		expect(elements.count()).toBeGreaterThan(0);

		element(by.css('span#rules-length')).getText().then (function (number) {
			number = parseInt(number);
			expect(number).toBeGreaterThan(0);

			var delbtn = element.all(by.repeater('socialmediarule in group.data')).last().element(by.css('button#btn-delete-rule'))
			delbtn.click();

			browser.sleep(1000);

			element(by.css('span#rules-length')).getText().then (function (new_number) {
				new_number = parseInt(new_number);
				expect(new_number).toEqual(number-1);
			});
		});
	});

});