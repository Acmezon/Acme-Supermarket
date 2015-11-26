describe('Load products', function () {
	it('Should load some products', function (){
		browser.get('http://localhost:3000');
		var products = element.all(by.repeater('product in products'));

		expect(products.count()).toEqual(2);
	});
});