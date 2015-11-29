describe('Register a customer with a wrong format email', function () {
	it('Shouldnt insert a customer in DB', function (){
		browser.get('http://localhost:3000/login');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('johndoemailcom');
		element(by.model('customer.password')).sendKeys('00000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// TODO: Check new costumer is redjected
	});
});