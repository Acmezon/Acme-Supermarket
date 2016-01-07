describe('Load products', function () {
	it('Should load some products', function (){
		browser.get('http://localhost:3000/products');
		var product = element.all(by.css('.product')).first();
		product.click();

		expect(element(by.css('.m_3')).getText()).toEqual('SUNGLASES')

	});
});