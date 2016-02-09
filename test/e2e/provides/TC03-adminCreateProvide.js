describe('Product page', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});


	it("should let admin create a provide", function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.provides@mail.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/myprofile');

		var id = element(by.css('span#id'));

		id.getText().then(function (text) {
			var supplier_id = parseInt(text);

			// Logout
			browser.manage().deleteAllCookies();

			browser.get('http://localhost:3000/signin');

			element(by.model('email')).sendKeys('admin@mail.com');
			element(by.model('password')).sendKeys('administrator');

			element(by.css('.button')).click();

			browser.get('http://localhost:3000/products');
			element(by.cssContainingText('option', 'Price')).click();

			browser.get('http://localhost:3000/product/31');

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
	
	it('should let the supplier remove the provide from the product', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.provides@mail.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/product/31');

		element.all(by.repeater('provide in out_suppliers')).count().then(function (count) {
			expect($('#delete-provide').isPresent()).toBe(true);
			$('#delete-provide').click();

			browser.get('http://localhost:3000/product/31');
			element.all(by.repeater('provide in out_suppliers')).count().then(function (new_count) {
				expect(new_count).toBe(count - 2);//2 ng-repeat over out_suppliers -> +-2 when added / removed
			});
		});
	});
});