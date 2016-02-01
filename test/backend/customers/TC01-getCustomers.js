var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe('Customers management api', function () {

	it("shouldn't return a customer to a non-authenticated user", function (done){
		var browser = request.agent();

		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/customers')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load the customers to a customer", function (done){
		var browser = request.agent();

		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/customers')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});


	it("shouldn't load the customers to a supplier", function (done){
		var browser = request.agent();

		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/customers')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});


	it('should load the customers', function (done){
		var browser = request.agent();

		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/customers')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.length.should.be.above(0);
				done();
			});
		});
	});

});