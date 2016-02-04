describe('Remove purchasing rule', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it('shouldn\'t remove a purchasing rule when clicking "No" button', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.rules@mail.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/mypurchasingrules');

		// Click on first delete button
		element.all(by.repeater('rule in $data')).count().then(function (count) {
			var deleteBtn = element.all(by.css('.btn-delete-rules')).first();

			deleteBtn.getAttribute('data-target').then(function (data_target) {
				deleteBtn.click().then(function() {
					browser.waitForAngular();
					var cancelBtn = element(by.css('div' + data_target + ' button.btn-danger'));

					var EC = protractor.ExpectedConditions;
					browser.wait(EC.visibilityOf(cancelBtn), 5000);

					cancelBtn.click().then(function () {
						browser.waitForAngular();
						browser.sleep(500)
						browser.get('http://localhost:3000/mypurchasingrules');
						element.all(by.repeater('rule in $data')).count().then(function (new_count) {
							expect(count).toBe(new_count);
						});
					});
				}); 
			});
		});
	});
	
	
	it('shouldn\'t remove a purchasing rule when clicking "Cancel" button', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.rules@mail.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/mypurchasingrules');

		// Click on first delete button
		element.all(by.repeater('rule in $data')).count().then(function (count) {
			var deleteBtn = element.all(by.css('.btn-delete-rules')).first();

			deleteBtn.getAttribute('data-target').then(function (data_target) {
				deleteBtn.click().then(function() {
					browser.waitForAngular();
					var cancelBtn = element(by.css('div' + data_target + ' button.btn-default'));

					var EC = protractor.ExpectedConditions;
					browser.wait(EC.visibilityOf(cancelBtn), 5000);

					cancelBtn.click().then(function () {
						browser.waitForAngular();
						browser.sleep(500)
						browser.get('http://localhost:3000/mypurchasingrules');
						element.all(by.repeater('rule in $data')).count().then(function (new_count) {
							expect(count).toBe(new_count);
						});
					});
				}); 
			});
		});
	});

	it('should remove a purchasing rule when clicking "Yes" button', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.rules@mail.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/mypurchasingrules');

		// Click on first delete button
		element.all(by.repeater('rule in $data')).count().then(function (count) {
			var deleteBtn = element.all(by.css('.btn-delete-rules')).first();

			deleteBtn.getAttribute('data-target').then(function (data_target) {
				deleteBtn.click().then(function() {
					browser.waitForAngular();
					var confirmBtn = element(by.css('div' + data_target + ' button.btn-confirm-rules'));

					var EC = protractor.ExpectedConditions;
					browser.wait(EC.visibilityOf(confirmBtn), 5000);

					confirmBtn.click().then(function () {
						browser.waitForAngular();
						browser.sleep(500)
						browser.get('http://localhost:3000/mypurchasingrules');
						element.all(by.repeater('rule in $data')).count().then(function (new_count) {
							expect(new_count).toBe(count - 2);
						});
					});
				}); 
			});
		});
	});

	it("should let and admin remove a purchasing rule", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/customers');

		browser.waitForAngular();

		element(by.css('input[name=email]')).sendKeys('no.rules@mail.com');

		browser.waitForAngular();

		var customer = element.all(by.xpath('//tr[@demo-tracked-table-row="customer"]')).first();

		customer.getAttribute('id').then(function (customer_id) {
			browser.get('http://localhost:3000/purchasingrules');

			browser.waitForAngular();

			$('#filterHeading a').click();

			browser.wait(function() {
				return element(by.model('customerFilter')).isDisplayed();
			}, 3000);

			element(by.model('customerFilter')).sendKeys(customer_id);
			element(by.css('[ng-click="filter(customerFilter)"]')).click();

			browser.waitForAngular();
			
			element.all(by.repeater("rule in purchasing_rules")).count().then(function (count) {
				var deleteBtn = element.all(by.css('button[ng-click="remove(rule._id)"]')).first();

				deleteBtn.click().then(function () {
					browser.sleep(1000);

					browser.get('http://localhost:3000/purchasingrules');

					browser.waitForAngular();

					$('#filterHeading a').click();

					browser.wait(function() {
						return element(by.model('customerFilter')).isDisplayed();
					}, 3000);

					element(by.model('customerFilter')).sendKeys(customer_id);
					element(by.css('[ng-click="filter(customerFilter)"]')).click();

					browser.waitForAngular();

					element.all(by.repeater("rule in purchasing_rules")).count().then(function (new_count) {
						//+2 because there are two ng-repeat and adding one element results in one more per repeater
						expect(new_count).toBe(count - 1);
					});
				});
			});
		});
	});
});