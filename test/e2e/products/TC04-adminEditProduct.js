describe('Edit product page', function () {
	it('should edit a product as an admin', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		//Ir a la pagina inicial, clicar sobre el primer producto


		//

		
		element(by.css('.btn .btn-default')).click();
	});
});