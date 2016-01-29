var request = require('supertest');
var should = require('should');
var assert = require('assert');
var jwt = require('jsonwebtoken');

describe("Purchase products from the API", function (){

	angular.module('test', ['test'])
        .config(['$http']);



	beforeEach(function() {

		browser.get('http://127.0.0.1:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		// Fill the shopping cart
		// Get a product
		request("http://127.0.0.1:3000")
			.get("/api/products/limit/1")
			.end(function(err1, res1){
				res1.status.should.be.equal(200);

				var product = res1.body[0];


				// Get provide
				request("http://127.0.0.1:3000")
				.get("/api/providesByProductId/" + product._id)
				.end(function(err2, res2){
					res2.status.should.be.equal(200);

					var provide = res2.body[0];

					var shoppingcart = {};
					shoppingcart[provide._id] = 10;

					// Mandatory visit in order to make cookies work
					browser.driver.get('http://127.0.0.1:3000/');
					browser.manage().addCookie('shoppingcart', JSON.stringify(shoppingcart), '/', '127.0.0.1');

				});
			});


	});

	it("Provide objects should be added to purchase of the customer", function(){
		browser.get('http://127.0.0.1:3000/');

		browser.manage().getCookie('session').then (function (response) {
			$http({
				method: 'GET',
				url: '/api/myProfile'
			}).
			then(function success(response) {
				console.log(response)
			});
		});

	});

});