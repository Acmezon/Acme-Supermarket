describe('Load products', function () {

	it('Should load 9 products from the home page', function (){
		browser.get('http://localhost:3000');
		var products = element.all(by.repeater('product in products'));

		expect(products.count()).toEqual(9);
	});

	it('Should load 9 products from the /products page', function (){

		browser.get('http://localhost:3000/products');
		var products = element.all(by.repeater('product in products'));

		expect(products.count()).toEqual(9);
	});

	it('Should load 9 products from the /products page and change pageSize to 15 and 30', function (){

		browser.get('http://localhost:3000/products');

		expect(element.all(by.repeater('product in products')).count()).toEqual(9);

		element(by.cssContainingText('option', '15')).click();

		browser.waitForAngular();

		expect(element.all(by.repeater('product in products')).count()).toEqual(15);

		element(by.cssContainingText('option', '30')).click();

		browser.waitForAngular();

		expect(element.all(by.repeater('product in products')).count()).toEqual(30);

	});

	it('Should load products from the /products page ordered', function (){

		browser.get('http://localhost:3000/products');

		// Ordered by name

		var nametags = element.all(by.css('div.top-box>div>div>a>div>div>div>p.title')).map(function (elm) {
			return elm.getText();
		});

		nametags.then(function (names) {
			var isordered = true;
			for (i = 0; i < names.length-1; i++) { 
				if (names[i] > names[i + 1]) {
					isordered = false;
				}
			}
			expect(isordered).toBeTruthy();
		});

		// Inverse ordered by name

		element(by.css('img.v-middle')).click()

		browser.waitForAngular();

		var nametags = element.all(by.css('div.top-box>div>div>a>div>div>div>p.title')).map(function (elm) {
			return elm.getText();
		});

		nametags.then(function (names) {
			var isordered = true;
			for (i = 0; i < names.length-1; i++) { 
				if (names[i] < names[i + 1]) {
					isordered = false;
				}
			}
			expect(isordered).toBeTruthy();
		});

		// Inverse ordered by min price

		element(by.cssContainingText('option', 'Price')).click();

		browser.waitForAngular();

		var pricetags = element.all(by.css('div.top-box>div>div>a>div>div>div>div>span')).map(function (elm) {
			return elm.getText();
		});

		pricetags.then(function (prices) {
			var isordered = true;
			for (i = 0; i < prices.length-1; i++) { 
				var minPrice = prices[i].split(" - ")[0];
				var nextMinPrice = prices[i+1].split(" - ")[0];
				if (minPrice < nextMinPrice) {
					isordered = false;
				}
			}
			expect(isordered).toBeTruthy();
		});

		// Ordered by min price

		element(by.css('img.v-middle')).click()

		browser.waitForAngular();

		var pricetags = element.all(by.css('div.top-box>div>div>a>div>div>div>div>span')).map(function (elm) {
			return elm.getText();
		});

		pricetags.then(function (prices) {
			var isordered = true;
			for (i = 0; i < prices.length-1; i++) { 
				var minPrice = prices[i].split(" - ")[0];
				var nextMinPrice = prices[i+1].split(" - ")[0];
				if (minPrice > nextMinPrice) {
					isordered = false;
				}
			}
			expect(isordered).toBeTruthy();
		});

		// Ordered by averagerating



		// Inverse ordered by average rating

		

	});

	it('Should load products from the /products page filtered by max price', function (){

		browser.get('http://localhost:3000/products');

		// Filter max price 200€
		element(by.css('div#price-pane>label:nth-child(7)>span')).click()

		browser.waitForAngular();

		var pricetags = element.all(by.css('div.top-box>div>div>a>div>div>div>div>span')).map(function (elm) {
			return elm.getText();
		});

		pricetags.then(function (prices) {
			var correct = true;
			for (i = 0; i < prices.length; i++) { 
				// Removes the " €" mark
				var aux = prices[i].slice(0, -2);
				// Get max price
				var maxPrice = aux.split(" - ")[1];
				if (maxPrice >= 200) {
					correct = false;
				}
			}
			expect(correct).toBeTruthy();
		});
	});


});