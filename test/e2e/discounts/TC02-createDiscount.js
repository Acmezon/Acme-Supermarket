describe('Discount management view', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't create the discount due to empty value", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/management/discounts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/management/discounts');
		browser.waitForAngular();

		element(by.css('h4.panel-title')).click();
		browser.waitForAngular();

		expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);

		element(by.id('generate-code')).click().then (function () {
			browser.waitForAngular();

			element(by.model('discount.code')).getAttribute('value').then (function (code){
				expect(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)).toEqual(true);
			});

			expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);
		})
	});

	it("shouldn't create the discount due to wrong discount value - higher value", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/management/discounts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/management/discounts');
		browser.waitForAngular();

		element(by.css('h4.panel-title')).click();
		browser.waitForAngular();

		expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);

		element(by.model('discount.value')).sendKeys(200);

		expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);

		element(by.id('generate-code')).click().then (function () {
			browser.waitForAngular();

			element(by.model('discount.code')).getAttribute('value').then (function (code){
				expect(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)).toEqual(true);
			});

			expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);
		})
	});

	it("shouldn't create the discount due to wrong discount value - text", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/management/discounts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/management/discounts');
		browser.waitForAngular();

		element(by.css('h4.panel-title')).click();
		browser.waitForAngular();

		expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);

		element(by.model('discount.value')).sendKeys('asdf');

		expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);

		element(by.id('generate-code')).click().then (function () {
			browser.waitForAngular();

			element(by.model('discount.code')).getAttribute('value').then (function (code){
				expect(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)).toEqual(true);
			});

			expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);
		})
	});

	it("shouldn't create the discount due to empty code", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/management/discounts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/management/discounts');
		browser.waitForAngular();

		element(by.css('h4.panel-title')).click();
		browser.waitForAngular();

		expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);

		element(by.model('discount.value')).sendKeys(50);

		expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);
	});

	it('should create the discount', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/management/discounts');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/management/discounts');
		browser.waitForAngular();

		element(by.id('discounts-length')).getText().then (function (number) {
			number = parseInt(number);

			element(by.css('h4.panel-title')).click();
			browser.waitForAngular();

			expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);

			element(by.model('discount.value')).sendKeys(50);

			expect(element(by.id('submit-discount')).isEnabled()).toEqual(false);

			element(by.id('generate-code')).click().then (function () {
				browser.waitForAngular();

				element(by.model('discount.code')).getAttribute('value').then (function (code){
					expect(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)).toEqual(true);
				});

				expect(element(by.id('submit-discount')).isEnabled()).toEqual(true);

				element(by.id('submit-discount')).click();
				browser.waitForAngular();

				element(by.id('discounts-length')).getText().then(function (new_number) {
					new_number = parseInt(new_number);
					expect(new_number).toEqual(number+1);
				});
			})
		});
	});

});