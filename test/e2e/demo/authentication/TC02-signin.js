describe('Log in to the system', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		browser.manage().deleteAllCookies();
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