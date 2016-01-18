describe('Management view the customers of the system', function () {
	it('Should load the customers', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/customers');
		var product = element.all(by.css('.product')).first();
		product.click();

		expect(element(by.css('.m_3')).getText()).toEqual('SUNGLASES')

	});
});