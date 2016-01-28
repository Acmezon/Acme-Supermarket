describe('Product details product', function () {
	
	beforeEach(function() {
		browser.get('http://localhost:3000/');
		element(by.css('[ng-click="signout()"]')).isPresent().then(function (result) {
			if(result) {
				element(by.css('[ng-click="signout()"]')).click()
			}
		});
	});
	
	it('shouldn\'t let an user rate', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/home');

		element(by.repeater('product in products').row(0)).$('a').click()

		var ratingElement = element(by.model('rate'));
		var prev_rate = -1;
		ratingElement.getAttribute('aria-valuenow').then(function (attr) {
			prev_rate = parseInt(attr);;
		})

		element(by.css('i[title="one"')).click()

		browser.refresh();

		var ratingElement = element(by.model('rate'));

		ratingElement.getAttribute('aria-valuenow').then(function (attr) {
			attr = parseInt(attr);
			if(prev_rate != 1)
				expect(attr).toBe(1);
			else
				expect(attr).toBe(0);
		})
	});
});