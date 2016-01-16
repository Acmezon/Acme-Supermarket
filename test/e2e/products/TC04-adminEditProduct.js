describe('Edit product page', function () {
	
	it('shouldn\'t show the edit button', function (){
		browser.get('http://localhost:3000/home');

		element(by.repeater('product in products').row(0)).$('a').click()

		expect(element(by.id('btn-edit')).isPresent()).toBe(false);
	});

	it('should edit a product as an admin', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/home');

		element(by.repeater('product in products').row(0)).$('a').click()

		expect(element(by.id('btn-edit')).isPresent()).toBe(true);

	});
});