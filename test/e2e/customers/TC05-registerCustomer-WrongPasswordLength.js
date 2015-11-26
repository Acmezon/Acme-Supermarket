describe('Register a customer with a password lower than 8 or greater than 32 characters', function () {
	it('Shouldnt insert a customer in DB', function (){
		browser.get('http://localhost:3000/login');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('johndoe@mail.com');
		element(by.model('customer.password')).sendKeys('0');

		// Click on submit
		element(by.id('signup-submit')).click();

		// TODO: Check new costumer is redjected
	});
});