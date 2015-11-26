describe('Load products', function () {
	it('Should load some products', function (){
		browser.get('http://10.10.0.142:3000');
		var products = element.all(by.repeater('product in products'));

		expect(products.count()).toEqual(2);
	});
});