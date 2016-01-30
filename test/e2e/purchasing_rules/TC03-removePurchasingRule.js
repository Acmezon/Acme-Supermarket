describe('Remove purchasing rule', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it('shouldn\'t remove a purchasing rule when clicking "No" button', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/mypurchasingrules');

		// Click on last delete button
		element.all(by.repeater('rule in $data')).count().then(function (count) {
			var row = element.all(by.repeater('rule in $data')).last()
			var deleteBtn = row.element(by.css('.btn-delete-rules'));

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

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/mypurchasingrules');

		// Click on last delete button
		element.all(by.repeater('rule in $data')).count().then(function (count) {
			var row = element.all(by.repeater('rule in $data')).last()
			var deleteBtn = row.element(by.css('.btn-delete-rules'));

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

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/mypurchasingrules');

		// Click on last delete button
		element.all(by.repeater('rule in $data')).count().then(function (count) {
			var row = element.all(by.repeater('rule in $data')).last()
			var deleteBtn = row.element(by.css('.btn-delete-rules'));

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
});