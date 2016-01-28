function stringGen(len) {
	var text = "";
	var charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
	for (var i = 0; i < len; i++)
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	return text;
}

describe('Edit product page', function() {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't show the edit button due to user non authenticated", function() {
		browser.get('http://localhost:3000/product/1');
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});

	it("shouldn't show the edit button due to user not admin", function() {
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		expect(element(by.id('btn-edit')).isPresent()).toBe(false);
	});

	it("should show the edit button to admin", function() {
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		expect(element(by.id('btn-edit')).isPresent()).toBe(true);
	});

	it("shouldn't edit the name field due to click in cancel button", function() {
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		expect(element(by.id('btn-edit')).isPresent()).toBe(true);

		var nametag = element(by.css('h3.m_3'));
		// Store old name
		nametag.getText().then(function(name) {
			// Click EDIT
			element(by.id('btn-edit')).click();
			browser.waitForAngular();

			// Fill form
			var new_name = stringGen(10);
			element(by.css('div.desc1>form:nth-child(3)>div>input')).clear().then(function() {
				element(by.css('div.desc1>form:nth-child(3)>div>input')).sendKeys(new_name);
			});
			// Click cancel
			element(by.css('div.desc1>form:nth-child(3)>div>span>button:nth-child(2)')).click();
			browser.waitForAngular();

			// Compare name values
			nametag.getText().then(function(newname) {
				// Expect new name be the old name
				expect(newname).toEqual(name);
			});

		});
	});

	it("should edit the name field", function() {
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		expect(element(by.id('btn-edit')).isPresent()).toBe(true);

		var nametag = element(by.css('h3.m_3'));
		// Store old name
		nametag.getText().then(function(name) {
			// Click EDIT
			element(by.id('btn-edit')).click();
			browser.waitForAngular();

			// Fill form
			var new_name = stringGen(7);
			element(by.css('div.desc1>form:nth-child(3)>div>input')).clear().then(function() {
				element(by.css('div.desc1>form:nth-child(3)>div>input')).sendKeys(new_name);
			});
			// Click on submit
			element(by.css('div.desc1>form:nth-child(3)>div>span>button:nth-child(1)')).click();
			browser.waitForAngular();

			// Compare name values
			nametag.getText().then(function(newname) {
				// Expect new name to be new name
				expect(new_name.toUpperCase()).toEqual(newname);
			});
		});
	});

	it("shouldn't edit the description field due to click in cancel button", function() {
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		expect(element(by.id('btn-edit')).isPresent()).toBe(true);

		var descriptiontag = element(by.css('p.m_text2'));
		// Store old description
		descriptiontag.getText().then(function(description) {
			// Click EDIT
			element(by.id('btn-edit')).click();
			browser.waitForAngular();

			// Fill form
			var new_description = stringGen(1001);
			element(by.css('textarea.editable-has-buttons')).clear().then(function() {
				element(by.css('textarea.editable-has-buttons')).sendKeys(new_description);
			});
			// Click on cancel
			element(by.css('form.editable-textarea>div>span>button:nth-child(2)')).click();
			browser.waitForAngular();

			// Compare description values
			descriptiontag.getText().then(function(newdescription) {
				// Expect new description to be old description
				expect(newdescription).toEqual(description);
			});

		});
	});
});