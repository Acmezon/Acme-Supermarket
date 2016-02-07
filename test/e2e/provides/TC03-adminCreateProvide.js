describe('Product page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	var randomnumber = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
	var supplier_id = Math.floor(Math.random() * (80 - 66 + 1)) + 66;


	it("should let admin create a provide", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/products');
		element(by.cssContainingText('option', 'Price')).click();

		element.all(by.css('div.top-box>div>div>a')).get(randomnumber).click();

		element.all(by.repeater('provide in out_suppliers')).count().then(function (number) {

			var addbtn = element.all(by.css('button#new-provide-admin')).first();
			expect(addbtn.isPresent()).toBe(true);
			addbtn.click();
			browser.waitForAngular();

			element(by.css('input#supplier_id')).sendKeys(supplier_id);
			element(by.css('input#price')).sendKeys('50');

			expect(element(by.css('table.table>tfoot>tr>td>button#add-provide')).isEnabled()).toBe(true);
			element(by.css('table.table>tfoot>tr>td>button#add-provide')).click()
			browser.waitForAngular();

			expect(element.all(by.repeater('provide in out_suppliers')).count()).toEqual(number+2)
		});
	});

});