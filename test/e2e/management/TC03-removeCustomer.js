describe('Management view the customers of the system', function () {
	it('Should remove a customers', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/customers');

		element(by.id('customers-length')).getText().then (function (text) {
			var number_customers = parseInt(text);
			expect(number_customers).toEqual(2);
		});

		// Click on first delete button
		var deleteBtn = element.all(by.css('.btn-delete-customers')).first();
		deleteBtn.click().then(function() {
			browser.waitForAngular();
			var confirmBtn = element.all(by.css('.btn-confirm-customers')).first();
			confirmBtn.click().then(function () {
				browser.waitForAngular();
				browser.sleep(500)
				element(by.id('customers-length')).getText().then (function (text) {
					var number_customers = parseInt(text);
					console.log(number_customers)
					expect(number_customers).toEqual(1);
				});
			});
			
		}); 

	});
});