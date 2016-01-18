describe('Management view the customers of the system', function () {
	it('Should load the customers', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/customers');

		element(by.id('customers-length')).getText().then (function (text) {
			var number_customers = parseInt(text);
			expect(number_customers).toEqual(2);
		});

	});
});