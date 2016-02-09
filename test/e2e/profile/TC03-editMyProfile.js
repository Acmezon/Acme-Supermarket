function stringGen(len) {
	var text = "";
	var charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
	for (var i = 0; i < len; i++)
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	return text;
}

describe('My profile page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an anonymous user edit its profile", function() {
		browser.get('http://localhost:3000/myprofile');

		// Expect not being in the same site
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/myprofile');
		// Redirecting... Expect being in signin page
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});

	it("should let a user edit its profile", function() {
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.provides@mail.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myprofile');

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/myprofile');

		expect(element(by.css('div#personalinfo')).isPresent()).toBe(true)

		var name_label = element(by.css('div#personalinfo>div:nth-child(3)>p'));
		var surname_label = element(by.css('div#personalinfo>div:nth-child(4)>p'));

		var new_name = stringGen(5);
		name_label.click();
		browser.waitForAngular();
		var name_input = element(by.css('input.editable-has-buttons'));
		name_input.clear().then (function () {
			name_input.sendKeys(new_name);
			var name_submit = element(by.css('span.editable-buttons>button:nth-child(1)'));
			name_submit.click();
			browser.waitForAngular();
			expect(element(by.css('div#personalinfo>div:nth-child(3)>p')).getText()).toEqual(new_name);
		});

		var new_surname = stringGen(5);
		surname_label.click();
		browser.waitForAngular();
		var surname_input = element(by.css('input.editable-has-buttons'));
		surname_input.clear().then (function () {
			surname_input.sendKeys(new_surname);
			var surname_submit = element(by.css('span.editable-buttons>button:nth-child(1)'));
			surname_submit.click();
			browser.waitForAngular();
			expect(element(by.css('div#personalinfo>div:nth-child(4)>p')).getText()).toEqual(new_surname);
		});


		expect(element(by.css('div#personalinfo>p:nth-child(5)')).getText()).toEqual('no.provides@mail.com')
	});

});