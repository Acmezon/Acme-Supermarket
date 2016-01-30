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

	it("should access to My Purchasing Rules page and there should be more than one", function (){
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
});