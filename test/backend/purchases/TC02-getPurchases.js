var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Purchases list', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user get the /purchases list", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchases/filtered')
			.send({ sort: 'paymentDate', order : -1 })
			.end(function (err, res) {

				res.status.should.be.equal(401);
				done();
			});
		});
	});

	it("shouldn't let a customer get the /purchases list", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchases/filtered')
			.send({ sort: 'paymentDate', order : -1 })
			.end(function (err, res) {
				res.status.should.be.equal(403);
				done();
			});
		});
	});

	it("shouldn't let a supplier get the /purchases list", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchases/filtered')
			.send({ sort: 'paymentDate', order : -1 })
			.end(function (err, res) {
				res.status.should.be.equal(403);
				done();
			});
		});
	});

	it("should let an admin get the purchases count", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchases/filtered/count')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				res.body.should.be.above(0);
				done();
			});
		});
	});

	it("shouldn't let an anonymous user get the purchases count", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchases/filtered/count')
			.end(function (err, res) {

				res.status.should.be.equal(401);
				done();
			});
		});
	});

	it("shouldn't let a customer get the purchases count", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchases/filtered/count')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				done();
			});
		});
	});

	it("shouldn't let a supplier get the purchases count", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchases/filtered/count')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				done();
			});
		});
	});

	it("should let an admin get the purchases count", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchases/filtered/count')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				res.body.should.be.above(0);
				done();
			});
		});
	});
});