describe('Notifications view', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't load the notifications due to not authenticated used", function (){
		browser.get('http://localhost:3000/notifications/1');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/401');
	});

	it("shouldn't load the notifications to a customer", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/notifications/1');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});


	it("shouldn't load the notifications to a supplier", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/notifications/1');

		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});


	it('should load the notifications', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/monitoringrules');
		browser.waitForAngular();
		var last_rule = element.all(by.repeater('socialmediarule in group.data')).last();
		last_rule.getAttribute('id').then (function (id) {
			last_rule.element(by.css('td>a>button.btn-info')).click();
			expect(browser.getCurrentUrl()).toBe('http://localhost:3000/notifications/'+id);
		});	

	});
});