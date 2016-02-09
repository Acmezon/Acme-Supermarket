describe('Discount management view', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't edit the discount due to empty value", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/management/discounts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/management/discounts');
		browser.waitForAngular();

		expect(element.all(by.repeater('discount in $data')).count()).toBeGreaterThan(0);

		var editbtn = element.all(by.repeater('discount in $data')).first().element(by.css('button.btn-edit-discount'));
		editbtn.click();
		browser.waitForAngular();

		var input = element.all(by.repeater('discount in $data')).first().element(by.css('input.editable-input'));
		input.clear().then (function () {

			var savebtn = element.all(by.repeater('discount in $data')).first().element(by.css('button.btn-save-discount'));
			expect(savebtn.isEnabled()).toEqual(false);
		});
	});

	it('should remove the discount', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/management/discounts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/management/discounts');
		browser.waitForAngular();

		element(by.id('discounts-length')).getText().then (function (number) {
			number = parseInt(number);

			var deletebtn = element.all(by.repeater('discount in $data')).last().element(by.css('button.btn-delete-discount'));
			deletebtn.click();
			browser.waitForAngular();

			element(by.id('discounts-length')).getText().then(function (new_number) {
				new_number = parseInt(new_number);
				expect(new_number).toEqual(number-1);
			});
		});
	});

	it('should edit the discount', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/management/discounts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/management/discounts');
		browser.waitForAngular();

		expect(element.all(by.repeater('discount in $data')).count()).toBeGreaterThan(0);

		var oldspan = element.all(by.repeater('discount in $data')).first().element(by.id('discount-value'));
		oldspan.getText().then(function (old_value) {
			old_value = parseInt(old_value);

			var editbtn = element.all(by.repeater('discount in $data')).first().element(by.css('button.btn-edit-discount'));
			editbtn.click();
			browser.waitForAngular();

			var input = element.all(by.repeater('discount in $data')).first().element(by.css('input.editable-input'));
			input.clear().then (function () {

				// random value 0-100
				var value = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
				input.sendKeys(value);

				var savebtn = element.all(by.repeater('discount in $data')).first().element(by.css('button.btn-save-discount'));
				expect(savebtn.isEnabled()).toEqual(true);
				savebtn.click();
				browser.waitForAngular();

				var newspan = element.all(by.repeater('discount in $data')).first().element(by.id('discount-value'));
				newspan.getText().then(function (new_value) {
					new_value = parseInt(new_value);

					expect(new_value).not.toEqual(old_value);
					expect(new_value).toEqual(value);

				});
			});
		});
	});

});