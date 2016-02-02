var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Purchase api', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user get a purchase", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/purchase/1')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let a supplier get purchase", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/purchase/1')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let a customer get 'notmine' purchase", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchases/mypurchases/filtered')
			.send({ sort: 'paymentDate', order : -1 })
			.end(function (err, res) {
				var purchase = res.body[0];

				browser
				.post('http://localhost:3000/api/signin')
				.send( { email : 'salvador.saez@example.com', password : 'customer' } )
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/purchase/'+purchase._id)
					.end(function (err, res) {
						res.status.should.be.equal(403);

						done();
					});
				});
			});
		});
	});

	it("should let customers get their purchases", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchases/mypurchases/filtered')
			.send({ sort: 'paymentDate', order : -1 })
			.end(function (err, res) {
				var purchase = res.body[0];

				browser
				.get('http://localhost:3000/api/purchase/'+purchase._id)
				.end(function (err, res) {
					res.status.should.be.equal(200);

					done();
				});
			});
		});
	});

	it("should let admin get a purchase", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/purchase/1')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				done();
			});
		});
	});
});