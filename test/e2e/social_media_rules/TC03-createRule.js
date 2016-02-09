describe('Social media monitoring rules page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("Shouldn't let a non-authenticated user create a purchase rule", function (){
		browser.get('http://localhost:3000/monitoringrules/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401')
	});

	it("Shouldn't let a supplier user create a purchase rule", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/monitoringrules/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("Shouldn't let a customer user create a purchase rule", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('sergio.gomez@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/monitoringrules/create');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("Should let an admin user create a purchase rule", function (){
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

			browser.get('http://localhost:3000/monitoringrules/create');
			expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/monitoringrules/create');

			var input_id = element(by.id('input-product-id'));
			var input_increaserate = element(by.id('input-increaserate'));
			var btn_save = element(by.id('createproductrule-submit'));

			input_id.sendKeys('50');
			input_increaserate.sendKeys('50');
			btn_save.click();

			browser.sleep(2000);

			element(by.css('span#rules-length')).getText().then (function (new_number) {
				new_number = parseInt(new_number);
				expect(new_number).toEqual(number+1);
			});

		});
	});
});