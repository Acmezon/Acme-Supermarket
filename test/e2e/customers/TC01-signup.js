describe('Register page', function () {
	it('shouldn\'t redirect nor insert customer in DB due to blank name.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail2@mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.id('coord-btn')).click();
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check view didnt redirect
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		

	});

	it('shouldn\'t redirect nor insert customer in DB due to blank surname.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('');
		element(by.model('customer.email')).sendKeys('newmail3@mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.id('coord-btn')).click();
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check view didnt redirect
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
	});

	it('shouldn\'t redirect nor insert customer in DB due to wrong email.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail3mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.id('coord-btn')).click();
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check view didnt redirect
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
	});

	it('shouldn\'t redirect nor insert customer in DB due to wrong password length', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail@mail.com');
		element(by.model('customer.password')).sendKeys('00');
		element(by.id('coord-btn')).click();
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check redirection is correct
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});

	it('shouldn\'t redirect nor insert customer in DB due to blank password.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail@mail.com');
		element(by.model('customer.password')).sendKeys('');
		element(by.id('coord-btn')).click();
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check redirection is correct
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});

	it('shouldn\'t redirect nor insert customer in DB due to blank address.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail@mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.id('coord-btn')).click();
		element(by.model('customer.address')).sendKeys('');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check redirection is correct
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});

	it('shouldn\'t redirect nor insert customer in DB due to blank country.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail@mail.com');
		element(by.id('coord-btn')).click();
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check redirection is correct
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});

	it('shouldn\'t redirect nor insert customer in DB due to blank city.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail@mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.id('coord-btn')).click();
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('');
		element(by.model('customer.phone')).sendKeys('000000000');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check redirection is correct
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});

	it('shouldn\'t redirect nor insert customer in DB due to blank phone.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail@mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.id('coord-btn')).click();
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check redirection is correct
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});

	it('shouldn\'t redirect nor insert customer in DB due to wrong phone length.', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail@mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.id('coord-btn')).click();
		element(by.model('customer.address')).sendKeys('Calle 1 Bloque A Bajo Derecha');
		element(by.cssContainingText('option', 'Congo')).click();
		element(by.model('customer.city')).sendKeys('Ciudad');
		element(by.model('customer.phone')).sendKeys('00');

		// Click on submit
		element(by.id('signup-submit')).click();

		// Check redirection is correct
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});

	it('shouldn\'t redirect nor insert customer in DB due to blank coordinates.', function (){
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
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/signup');
		
	});

	it('should redirect correctly', function (){
		browser.get('http://localhost:3000/signup');
		
		// Insert values into form inputs
		element(by.model('customer.name')).sendKeys('John');
		element(by.model('customer.surname')).sendKeys('Doe');
		element(by.model('customer.email')).sendKeys('newmail@mail.com');
		element(by.model('customer.password')).sendKeys('00000000');
		element(by.id('coord-btn')).click();
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