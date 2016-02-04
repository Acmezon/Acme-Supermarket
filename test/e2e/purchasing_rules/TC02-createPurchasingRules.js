describe('Create purchasing rule', function () {

	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't show a button for every provide due to already having a rule for one of them", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchasingrules');

		browser.waitForAngular();
		
		element.all(by.css('td > a')).first().click();

		element.all(by.repeater("provide in out_suppliers")).count().then(function (provide_count) {
			element.all(by.css("td.create-rule > button")).count().then(function (create_rule_count) {
				expect(create_rule_count).toBeLessThan(provide_count);
			})
		})
	});

	it("shouldn't create a new purchasing rule due to invalid date", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.rules@mail.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchasingrules');

		browser.waitForAngular();
		
		element.all(by.repeater("rule in $data")).count().then(function (count) {
			browser.get('http://localhost:3000/products');

			element.all(by.css('div.top-box>div>div>a>div')).first().click();

			browser.waitForAngular();

			var createBtn = element.all(by.css('td.create-rule > button')).first();

			createBtn.getAttribute('data-target').then(function (data_target) {
				createBtn.click().then(function() {
					browser.waitForAngular();
					var confirmBtn = element(by.css('div'+data_target+' button'));

					browser.wait(function() {
						return confirmBtn.isPresent();
					}, 5000);

					var form = element.all(by.css('form#submit-form')).first();

					form.element(by.css('input[name=startDate]')).sendKeys("30-01-2015");
					form.element(by.css('input[name=periodicity]')).sendKeys(1);
					form.element(by.css('input[name=quantity]')).sendKeys(1);

					confirmBtn.click().then(function () {
						browser.waitForAngular();
						browser.sleep(500)
						browser.get('http://localhost:3000/mypurchasingrules');
						element.all(by.repeater("rule in $data")).count().then(function (new_count) {
							//+2 because there are two ng-repeat and adding one element results in one more per repeater
							expect(new_count).toBe(count);
						});
					});
				}); 
			});
		});
	});

	it("shouldn't create a new purchasing rule due to invalid quantity", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.rules@mail.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchasingrules');

		browser.waitForAngular();
		
		element.all(by.repeater("rule in $data")).count().then(function (count) {
			browser.get('http://localhost:3000/products');

			element.all(by.css('div.top-box>div>div>a>div')).first().click();

			browser.waitForAngular();

			var createBtn = element.all(by.css('td.create-rule > button')).first();

			createBtn.getAttribute('data-target').then(function (data_target) {
				createBtn.click().then(function() {
					browser.waitForAngular();
					var confirmBtn = element(by.css('div'+data_target+' button'));

					browser.wait(function() {
						return confirmBtn.isPresent();
					}, 5000);

					var form = element.all(by.css('form#submit-form')).first();

					form.element(by.css('input[name=startDate]')).sendKeys("30-01-2017");
					form.element(by.css('input[name=periodicity]')).sendKeys(1);
					form.element(by.css('input[name=quantity]')).sendKeys(-1);

					confirmBtn.click().then(function () {
						browser.waitForAngular();
						browser.sleep(500)
						browser.get('http://localhost:3000/mypurchasingrules');
						element.all(by.repeater("rule in $data")).count().then(function (new_count) {
							//+2 because there are two ng-repeat and adding one element results in one more per repeater
							expect(new_count).toBe(count);
						});
					});
				}); 
			});
		});
	});

	it("shouldn't create a new purchasing rule due to invalid periodicity", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.rules@mail.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchasingrules');

		browser.waitForAngular();
		
		element.all(by.repeater("rule in $data")).count().then(function (count) {
			browser.get('http://localhost:3000/products');

			element.all(by.css('div.top-box>div>div>a>div')).first().click();

			browser.waitForAngular();

			var createBtn = element.all(by.css('td.create-rule > button')).first();

			createBtn.getAttribute('data-target').then(function (data_target) {
				createBtn.click().then(function() {
					browser.waitForAngular();
					var confirmBtn = element(by.css('div'+data_target+' button'));

					browser.wait(function() {
						return confirmBtn.isPresent();
					}, 5000);

					var form = element.all(by.css('form#submit-form')).first();

					form.element(by.css('input[name=startDate]')).sendKeys("30-01-2017");
					form.element(by.css('input[name=periodicity]')).sendKeys(-1);
					form.element(by.css('input[name=quantity]')).sendKeys(1);

					confirmBtn.click().then(function () {
						browser.waitForAngular();
						browser.sleep(500)
						browser.get('http://localhost:3000/mypurchasingrules');
						element.all(by.repeater("rule in $data")).count().then(function (new_count) {
							//+2 because there are two ng-repeat and adding one element results in one more per repeater
							expect(new_count).toBe(count);
						});
					});
				}); 
			});
		});
	});

	it("should create a new purchasing rule", function (){
		// Login
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('no.rules@mail.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/mypurchasingrules');

		browser.waitForAngular();
		
		element.all(by.repeater("rule in $data")).count().then(function (count) {
			browser.get('http://localhost:3000/products');

			element.all(by.css('div.top-box>div>div>a>div')).first().click();

			browser.waitForAngular();

			var createBtn = element.all(by.css('td.create-rule > button')).first();

			createBtn.getAttribute('data-target').then(function (data_target) {
				createBtn.click().then(function() {
					browser.waitForAngular();
					var confirmBtn = element(by.css('div'+data_target+' button'));

					browser.wait(function() {
						return confirmBtn.isPresent();
					}, 5000);

					var form = element.all(by.css('form#submit-form')).first();

					form.element(by.css('input[name=startDate]')).sendKeys("30-01-2017");
					form.element(by.css('input[name=periodicity]')).sendKeys(1);
					form.element(by.css('input[name=quantity]')).sendKeys(1);

					confirmBtn.click().then(function () {
						browser.sleep(1000);

						browser.get('http://localhost:3000/mypurchasingrules');
						element.all(by.repeater("rule in $data")).count().then(function (new_count) {
							//+2 because there are two ng-repeat and adding one element results in one more per repeater
							expect(new_count).toBe(count + 2);
						});
					});
				}); 
			});
		});
	});

	it("should let and admin create a new purchasing rule", function (){
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
				browser.get('http://localhost:3000/products');

				element.all(by.css('div.top-box>div>div>a>div')).last().click();

				browser.waitForAngular();

				var createBtn = element.all(by.css('td.create-rule > button')).first();

				createBtn.getAttribute('data-target').then(function (data_target) {
					createBtn.click().then(function() {
						browser.waitForAngular();
						var confirmBtn = element(by.css('div'+data_target+' button'));

						browser.wait(function() {
							return confirmBtn.isPresent();
						}, 5000);

						var form = element.all(by.css('form#submit-form')).first();

						form.element(by.css('input[name=customerid]')).sendKeys(customer_id);
						form.element(by.css('input[name=startDate]')).sendKeys("30-01-2017");
						form.element(by.css('input[name=periodicity]')).sendKeys(1);
						form.element(by.css('input[name=quantity]')).sendKeys(1);
						
						confirmBtn.click().then(function () {
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
								expect(new_count).toBe(count + 1);
							});
						});
					}); 
				});
			});
		});
	});

	it("shouldn't let and admin create a new purchasing rule due to the customer already has a rule for that provide", function (){
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
				browser.get('http://localhost:3000/products');

				//Sames as clicked by user two tests earlier
				element.all(by.css('div.top-box>div>div>a>div')).first().click();

				browser.waitForAngular();

				var createBtn = element.all(by.css('td.create-rule > button')).first();

				createBtn.getAttribute('data-target').then(function (data_target) {
					createBtn.click().then(function() {
						browser.waitForAngular();
						var confirmBtn = element(by.css('div'+data_target+' button'));

						browser.wait(function() {
							return confirmBtn.isPresent();
						}, 5000);

						var form = element.all(by.css('form#submit-form')).first();

						form.element(by.css('input[name=customerid]')).sendKeys(customer_id);
						form.element(by.css('input[name=startDate]')).sendKeys("30-01-2017");
						form.element(by.css('input[name=periodicity]')).sendKeys(1);
						form.element(by.css('input[name=quantity]')).sendKeys(1);

						confirmBtn.click().then(function () {
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
								expect(new_count).toBe(count);
							});
						});
					}); 
				});
			});
		});
	});
});