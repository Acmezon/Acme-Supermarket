describe('Register a customer with a phone lower than 9 or greater than 15 characters length', function () {
	it('Shouldnt insert a customer in DB', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('johndoe@mail.com');
		element(by.model('customer.password')).sendKeys('');
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('0');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check view didnt redirect
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});
});