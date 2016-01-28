describe('Log in to the system', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		browser.manage().deleteAllCookies();
	});

	it("shouldn't show the logout link and clear cookies due to user non authenticated.", function (){
		browser.get('http://localhost:3000/');

		expect(element(by.id('logout')).isPresent()).toBe(false);
	});

	it("should show the logout link and clear cookies.", function (){

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/');

		var logout_button = element(by.id('logout'))
		expect(logout_button.isPresent()).toBe(true);

		// Click logout
		logout_button.click();
		browser.waitForAngular();

		// Cleared cookies
		browser.manage().getCookies().then(function (cookies) {
			expect(cookies.length).toBeLessThan(2);
		});
	});

});