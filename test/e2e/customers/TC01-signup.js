describe('Register a customer', function () {
	it('Register a customer. Should redirect correctly', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail@mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check redirection is correct
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signin');
		
	});
});