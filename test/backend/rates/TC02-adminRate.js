var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Product rating and Provide rating', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user rate for other", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/ratings/manage')
			.send({customer_id : 1, product_id: 1, value: 5})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a customer rate for other", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'daniel.diaz@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/ratings/manage')
			.send({customer_id : 1, product_id: 1, value: 5})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a supplier rate for other", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/ratings/manage')
			.send({customer_id : 1, product_id: 1, value: 5})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a admin rate for a not found user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/ratings/manage')
			.send({customer_id : 99999999999, product_id: 1, value: 5})
			.end(function (err, res) {
				res.status.should.be.equal(503);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a admin rate for a not found product", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/ratings/manage')
			.send({customer_id : 1, product_id: 99999999999999999, value: 5})
			.end(function (err, res) {
				res.status.should.be.equal(503);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should let a admin rate for a customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/ratings/manage')
			.send({customer_id : 1, product_id: 99999999999999999, value: 5})
			.end(function (err, res) {
				res.status.should.be.equal(503);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});


	
	
});