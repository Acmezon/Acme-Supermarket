var path = require('path');

function stringGen(len) {
	var text = "";
	var charset = "0123456789";
	for( var i=0; i < len; i++ )
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	return text;
}

function ean13_checksum(message) {
    var checksum = 0;
    message = message.split('').reverse();
    for(var pos in message){
        checksum += message[pos] * (3 - 2 * (pos % 2));
    }
    return ((10 - (checksum % 10 )) % 10);
}

function randomEAN13(){
	var p1 = stringGen(12)
	var p2 = ean13_checksum(p1).toString()
	return p1 + p2
}

describe('Product creation', function () {


	beforeEach(function() {
		// Mandatory visit in order to make cookies work
		browser.driver.get('http://localhost:3000/');
		// Logout
		browser.manage().deleteAllCookies();
	});

	it("shouldn't let a customer create a product", function() {
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('margarita.medina@example.com');
		element(by.model('password')).sendKeys('customer');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/products/create');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/products/create');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	it("shouldn't let a supplier create a product", function() {
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('ismael.perez@example.com');
		element(by.model('password')).sendKeys('supplier');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/products/create');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/products/create');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/403');
	});

	it("shouldn't let an anonymous user create a product", function() {	
		browser.get('http://localhost:3000/products/create');

		expect(browser.getCurrentUrl()).not.toBe('http://localhost:3000/products/create');
		expect(browser.getCurrentUrl()).toBe('http://localhost:3000/401');
	});

	it('should let the admin create a product', function (){		
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/products');
		
		element(by.css('a.add-product')).click();

		var product_name = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
		element(by.model('name')).sendKeys(product_name);
		element(by.model('description')).sendKeys('Prueba descripción');
		element(by.model('code')).sendKeys(randomEAN13());
		element(by.css('span.input-group-btn>button')).click()
		var fileToUpload = '../../resources/images/img-thing.jpg',
		absolutePath = path.resolve(__dirname, fileToUpload);

		$('form#submit-form>div:nth-child(5)>input[type="file"]').sendKeys(absolutePath);

		$('button#createproduct-submit').click();

		browser.get('http://localhost:3000/products');
		browser.waitForAngular();

		//TODO vista de productos no disponibles

		// Inverse order
		element(by.css('img.v-middle')).click()
		browser.waitForAngular();

		element.all(by.repeater('product in products')).then(function (products) {
			var productName = products[0].element(by.className('title'));
			expect(productName.getText()).toEqual(product_name);
		});
	});

})