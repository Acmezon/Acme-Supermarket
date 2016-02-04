describe('Load purchasing rules', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't visit purchasing rules page due to non authenticated user", function (){
		browser.get('http://localhost:3000/mypurchasingrules');
		
		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/mypurchasingrules');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});
	
	it("shouldn't let a supplier visit all purchasing rules page", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchasingrules');
		
		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/mypurchasingrules');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("shouldn't let an admin visit all purchasing rules page", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchasingrules');
		
		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/mypurchasingrules');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("should let a customer access all purchasing rules page and there should be more than one", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchasingrules');
		
		// Save visited product id
		var rules = element.all(by.repeater('rule in $data'));
		
		rules.count().then(function (count) {
			expect(count).toBeGreaterThan(0);
		});
		
	});

	it("shouldn't visit all purchasing rules page due to non authenticated user", function (){
		browser.get('http://localhost:3000/purchasingrules');
		
		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/purchasingrules');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});
	
	it("shouldn't let a supplier visit all purchasing rules page", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/purchasingrules');
		
		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/purchasingrules');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("shouldn't let an customer visit all purchasing rules page", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/purchasingrules');
		
		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/purchasingrules');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/403');
	});

	it("should let an admin access to all purchasing rules page and there should be more than one", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/purchasingrules');

		browser.waitForAngular();
		
		var rules = element.all(by.repeater('rule in purchasing_rules'));
		
		rules.count().then(function (count) {
			expect(count).toBeGreaterThan(0);
		});
		
	});
});