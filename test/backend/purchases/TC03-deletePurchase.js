var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Purchases list', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user delete a purchase", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.del('http://localhost:3000/api/purchase')
			.send({ id: 1 })
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a customer delete a purchase", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.del('http://localhost:3000/api/purchase')
			.send({ id: 1 })
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let a supplier delete a purchase", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.del('http://localhost:3000/api/purchase')
			.send({ id: 1 })
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("should let an admin delete a purchase", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchases/filtered')
			.send({ sort: 'paymentDate', order : -1 })
			.end(function (err, res) {
				var purchase = res.body[0];

				browser
				.del('http://localhost:3000/api/purchase')
				.send({ id: purchase._id })
				.end(function (err, res) {
					res.status.should.be.equal(200);

					res.body.success.should.be.true;
					done();
				});
			});
		});
	});
});