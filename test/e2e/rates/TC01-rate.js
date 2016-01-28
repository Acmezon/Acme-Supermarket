function stringGen(len) {
	var text = "";
	var charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
	for( var i=0; i < len; i++ )
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	return text;
}

describe('Product rating and Provide rating', function () {
	
	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an user rate due to non authenticated", function (){
		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		var ratingElement = element(by.model('rate'));
		expect(ratingElement.isPresent()).toBe(false);
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/401');
	});
	
	it("shouldn't let an user rate due not a customer", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		var ratingElement = element(by.model('rate'));
		expect(ratingElement.isPresent()).toBe(false);

		var supplierRElement = element(by.model('provide.reputation'));
		expect(ratingElement.isPresent()).toBe(false);
	});

	it("shouldn't let an user rate due customer hasn't purchased it yet", function (){
		var email = stringGen(6) + '@mail.com';

		// New customer hasnt purchased anything
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys(email);
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.model('customer.phone')).sendKeys('954946689');
		element(by.id('coord-btn')).click();
		browser.sleep(5000);
		// Click on submit
		element(by.css('button#signup-submit')).click();

		browser.sleep(1000);

		element(by.model('email')).sendKeys(email);
		element(by.model('password')).sendKeys('00000000');

		element(by.css('.button')).click();

		browser.sleep(1000);

		// Visit product
		browser.get('http://localhost:3000/');
		element.all(by.css('div.top-box>div>div>a>div')).first().click();;
		browser.waitForAngular();

		// Expect not redirected
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/401');

		var ratingElement = element(by.model('rate'));
		expect(ratingElement.isPresent()).toBe(false);

		var supplierRElement = element(by.model('provide.reputation'));
		expect(ratingElement.isPresent()).toBe(false);
	});

	it("should let an user rate.", function () {

		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.sleep(1000);

		// Visit purchase
		browser.get('http://localhost:3000/mypurchases');

		// Expect not redirected
		expect(browser.getCurrentUrl()).not.toEqual('http://localhost:3000/401');

		element.all(by.repeater('purchase in purchases')).last().element(by.model('purchase._id')).click();
		browser.waitForAngular();

		// Visit product
		element.all(by.repeater('purchaseline in purchase_list')).last().element(by.model('purchaseline.product._id')).click();
		browser.waitForAngular();

		var ratingElement = element(by.model('rate'));
		expect(ratingElement.isPresent()).toBe(true);

		var supplierRElement = element(by.model('provide.reputation'));
		expect(ratingElement.isPresent()).toBe(true);
	});

});