describe('Product details page', function () {

	beforeEach(function() {
		browser.get('http://localhost:3000/');
		element(by.css('[ng-click="signout()"]')).isPresent().then(function (result) {
			if(result) {
				element(by.css('[ng-click="signout()"]')).click()
			}
		});
	});

	it('should let the supplier provide the product', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('gustavo.santana@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/product/31');


		element.all(by.repeater('provide in out_suppliers')).count().then(function (count) {
			element(by.model('new_provide.price')).sendKeys(30);

			$('#provideproduct-submit').click();

			browser.get('http://localhost:3000/product/31');
			element.all(by.repeater('provide in out_suppliers')).count().then(function (new_count) {
				expect(new_count).toBe(count + 1);
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
			$('#delete-provide').click();

			browser.get('http://localhost:3000/product/31');
			element.all(by.repeater('provide in out_suppliers')).count().then(function (new_count) {
				expect(new_count).toBe(count - 1);
			});
		});
	});

	it('shouldn\'t let a customer manage provides', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('joan.soler@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/product/31');

		expect(element(by.css('.supply-form')).isPresent()).toBe(false);
	});
});