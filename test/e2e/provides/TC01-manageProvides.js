describe('Product details page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let an anonymous user provide a product", function (){
		browser.get('http://localhost:3000/product/31');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/product/31');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/401');
	});

	it("shouldn't let a customer provide a product", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('daniel.diaz@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/product/31');

		expect(element(by.model('new_provide.price')).isPresent()).toBe(false);
	});

	it("shouldn't let a admin provide a product", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/product/31');

		expect(element(by.model('new_provide.price')).isPresent()).toBe(false);
	});;

	it('should let the supplier provide the product', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('gustavo.santana@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/product/31');

		element.all(by.repeater('provide in out_suppliers')).count().then(function (count) {
			expect(element(by.model('new_provide.price')).isPresent()).toBe(true);
			element(by.model('new_provide.price')).sendKeys(30);

			element(by.id('provideproduct-submit')).click();

			browser.sleep(1000)
			element.all(by.repeater('provide in out_suppliers')).count().then(function (new_count) {
				expect(new_count).toBe(count + 2);//2 ng-repeat over out_suppliers -> +-2 when added / removed
			});
		});
	});

	it('should let the supplier remove the provide from the product', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('gustavo.santana@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/product/31');

		element.all(by.repeater('provide in out_suppliers')).count().then(function (count) {
			expect($('#delete-provide').isPresent()).toBe(true);
			$('#delete-provide').click();

			browser.get('http://localhost:3000/product/31');
			element.all(by.repeater('provide in out_suppliers')).count().then(function (new_count) {
				expect(new_count).toBe(count - 2);//2 ng-repeat over out_suppliers -> +-2 when added / removed
			});
		});
	});
});