var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Provides API', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user provide", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/provide/admin/create')
			.send({product_id: 1, supplier_id: 70, price : 1})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a customer provide", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/provide/admin/create')
			.send({product_id: 1, supplier_id: 70, price : 1})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a supplier provide for other supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/provide/admin/create')
			.send({product_id: 1, supplier_id: 70, price : 1})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a admin provide for a supplier - due to user not a supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/provide/admin/create')
			.send({product_id: 100, supplier_id: 1, price : 1})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a admin provide for a supplier - due to user not found", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/provide/admin/create')
			.send({product_id: 100, supplier_id: 999, price : 1})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should let a admin provide for a supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/provide/admin/create')
			.send({product_id: 100, supplier_id: 70, price : 1})
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.should.be.ok();
				done();
			});
		});
	});
});