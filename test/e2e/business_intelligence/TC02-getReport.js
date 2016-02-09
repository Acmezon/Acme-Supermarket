describe('Sales report view', function () {
	
	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't load the report due to not authenticated used", function (){
		browser.get('http://localhost:3000/reports');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/401');
	});

	it("shouldn't load the report to a customer", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/reports');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});


	it("shouldn't load the report to a supplier", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/reports');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	it('shouldnt show the report to the administrator due to supplier not found', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/reports');

		element(by.model('supplierEmail')).sendKeys("asdf@example.com");
		element(by.model('year')).sendKeys("2015");

		var submitBtn = element(by.css('#report-submit'));
		expect(submitBtn.isEnabled()).toBe(true)
		
		submitBtn.click().then(function() {
			browser.driver.sleep(10000);
			browser.waitForAngular();

			var canvas = element(by.id("pdf-canvas"));

			expect(canvas.isPresent()).toBe(false);
		}); 

	});

	it('shouldnt show the report to the administrator due to wrong format email', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/reports');

		element(by.model('supplierEmail')).sendKeys("wrong email");
		element(by.model('year')).sendKeys("2015");

		var submitBtn = element(by.css('#report-submit'));
		expect(submitBtn.isEnabled()).toBe(false)
	});

	it('shouldnt show the report to the administrator due to wrong format year', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/reports');

		element(by.model('supplierEmail')).sendKeys("consuelo.lopez@example.com");
		element(by.model('year')).sendKeys("qwerty1234567890");

		var submitBtn = element(by.css('#report-submit'));
		expect(submitBtn.isEnabled()).toBe(false)
	});

	it('should show the report to the administrator', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/reports');

		element(by.model('supplierEmail')).sendKeys("consuelo.lopez@example.com");
		var max = new Date().getFullYear(),
    		min = 2010;
    	var randomyear = Math.floor(Math.random()*(max-min+1)+min);

		element(by.model('year')).sendKeys(randomyear);

		var submitBtn = element(by.css('#report-submit'));
		expect(submitBtn.isEnabled()).toBe(true)
		
		submitBtn.click().then(function() {
			browser.driver.sleep(10000);
			browser.waitForAngular();

			var canvas = element(by.id("pdf-canvas"));

			expect(canvas.isPresent()).toBe(true);
		}); 

	});
});