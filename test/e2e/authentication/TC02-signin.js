describe('Log in to the system', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		browser.manage().deleteAllCookies();
	});


	it("shouldn't redirect nor create cookies of the system due to wrong email.", function (){

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('wrongemail');
		element(by.model('password')).sendKeys('administrator');

		// Check view didnt redirect
		expect(element(by.css('.button')).getAttribute('disabled')).toEqual('true');

		browser.manage().getCookies().then(function (cookies) {
			expect(cookies.length).toBeLessThan(2);
		});
	});

	it("shouldn't redirect nor create cookies of the system due to wrong password too small.", function (){

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('1');

		// Check view didnt redirect
		expect(element(by.css('.button')).getAttribute('disabled')).toEqual('true');

		browser.manage().getCookies().then(function (cookies) {
			expect(cookies.length).toBeLessThan(2);
		});
	});

	it("shouldn't redirect nor create cookies of the system due to wrong password too large.", function (){

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('01234567890123456789012345678901234567890123456789');

		// Check view didnt redirect
		expect(element(by.css('.button')).getAttribute('disabled')).toEqual('true');

		browser.manage().getCookies().then(function (cookies) {
			expect(cookies.length).toBeLessThan(2);
		});
	});

	it("Wrong login user not found", function (){

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ada@umbrella.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.sleep(1000);

		// Check view didnt redirect
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signin');

		browser.manage().getCookies().then(function (cookies) {
			expect(cookies.length).toBeLessThan(2);
		});
	});

	it("Wrong login wrong password", function (){

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('wrongpassword');

		element(by.css('.button')).click();

		browser.sleep(1000);

		// Check view didnt redirect
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signin');

		browser.manage().getCookies().then(function (cookies) {
			expect(cookies.length).toBeLessThan(2);
		});
	});

	it("Succesful admin login. Redirected and stores cookie", function (){

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.sleep(1000);

		// Check view didnt redirect
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/');

		browser.manage().getCookies().then(function (cookies) {
			expect(cookies.length).toBeGreaterThan(1);
		});
	});
});