describe('Sales over time view', function () {
	
	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't load the notifications due to not authenticated used", function (){
		browser.get('http://localhost:3000/salesovertime');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/401');
	});

	it("shouldn't load the notifications to a customer", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/salesovertime');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});


	it("shouldn't load the notifications to a supplier", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/salesovertime');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	it('should show  the chart', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/salesovertime');

		element.all(by.model('supplierEmail')).sendKeys("ana.munoz@example.com");

		var submitBtn = element(by.css('#signup-submit'));
		
		submitBtn.click().then(function() {
			browser.driver.sleep(5000);
			browser.waitForAngular();

			var canvas = element.all(by.css("#sales-chart canvas")).first();

			expect(canvas.isPresent()).toBe(true);
		}); 

	});
});