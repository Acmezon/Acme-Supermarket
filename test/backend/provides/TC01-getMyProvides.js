var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('My product list page', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user get the /myproducts list", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/products/myproducts/filtered')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				done();
			});
		});
	});

	it("shouldn't let customer get the /myproducts list", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			should.not.exist(err);

			browser
			.post('http://localhost:3000/api/products/myproducts/filtered')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				done();
			});
		});
	});

	it("shouldn't let admin get the /myproducts list", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			should.not.exist(err);

			browser
			.post('http://localhost:3000/api/products/myproducts/filtered')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				done();
			});
		});
	});

	it("should let supplier get the /myproducts list", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			should.not.exist(err);
			
			browser
			.post('http://localhost:3000/api/products/myproducts/filtered')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				res.body.length.should.be.above(0);
				done();
			});
		});
	});
});