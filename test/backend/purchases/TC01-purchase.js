var request = require('superagent');
var should = require('should');
var assert = require('assert');

var adminToken = "j%3A%7B%22token%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicGFzc3dvcmQiOiIyMDBjZWIyNjgwN2Q2YmY5OWZkNmY0ZjBkMWNhNTRkNCIsImlhdCI6MTQ1NDQyNTk4OCwiZXhwIjoxNDg1OTYxOTg4fQ.FQ6KEEG-HecARNpzCqvIEcFqplp4DQjUsG9JBqNp7bw%22%7D";
var supplierToken = "j%3A%7B%22token%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImlzbWFlbC5wZXJlekBleGFtcGxlLmNvbSIsInBhc3N3b3JkIjoiOTliMGU4ZGEyNGUyOWU0Y2NiNWQ3ZDc2ZTY3N2MyYWMiLCJpYXQiOjE0NTQ0MjYwMzQsImV4cCI6MTQ4NTk2MjAzNH0.zlIJqCMfzk46cmYHt2HhTDfPl0wrcJKIU6ROR7JQhMM%22%7D";
var customerToken = "j%3A%7B%22token%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFsZXguZ2FsbGFyZG9AZXhhbXBsZS5jb20iLCJwYXNzd29yZCI6IjkxZWMxZjkzMjQ3NTMwNDhjMDA5NmQwMzZhNjk0Zjg2IiwiaWF0IjoxNDU0NDI2MDY0LCJleHAiOjE0ODU5NjIwNjR9.iu20g81kl-Fk3kIinDLcsD96P98XhUomqPJL0u5FZas%22%7D";

describe('Checkout', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user purchase", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/purchase/process/1')
			.set('Cookie', ['shoppingcart={ "2" : 1}']) //Provide_id = 2, quantity = 1
			.end(function (err, res) {

				res.status.should.be.equal(403);
				done();
			});
		});
	});

	it("shouldn't let an admin purchase", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/purchase/process/1')
			.set('Cookie', 'shoppingcart={ "2" : 1};session=' + adminToken) //Provide_id = 2, quantity = 1
			.end(function (err, res) {
				res.status.should.be.equal(401);
				done();
			});
		});
	});

	it("shouldn't let a supplier purchase", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/purchase/process/1')
			.set('Cookie', 'shoppingcart={ "2" : 1};session=' + supplierToken) //Provide_id = 2, quantity = 1
			.end(function (err, res) {
				res.status.should.be.equal(401);
				done();
			});
		});
	});

	it("shouldn\'t' let a customer purchase due to unexisting shopping cart cookie", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/purchase/process/1')
			.end(function (err, res) {
				res.status.should.be.equal(500);
				done();
			});
		});
	});

	it("shouldn\'t' let a customer purchase due to invalid billing method", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/purchase/process/9')
			.set('Cookie', 'shoppingcart={ "2" : 1};session=' + customerToken) //Provide_id = 2, quantity = 1
			.end(function (err, res) {
				res.status.should.be.equal(503);
				done();
			});
		});
	});

	it("should let a customer purchase", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/purchase/process/1')
			.set('Cookie', 'shoppingcart={ "2" : 1};session=' + customerToken) //Provide_id = 2, quantity = 1
			.end(function (err, res) {
				res.status.should.be.equal(200);
				var customer_id = res.body.customer_id;

				browser
				.get('http://localhost:3000/api/myprofile')
				.end(function (err, res) {
					res.body.id.should.be.equal(customer_id);
					done();
				});
			});
		});
	});
});