var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Purchase api', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user purchase for other user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchase/admin')
			.send({ 
				billingMethod : 1,
				customer_id: 50,
				shoppingcart : {'100': 1},
				discountCode : null
			})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a customer user purchase for other user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchase/admin')
			.send({ 
				billingMethod : 1,
				customer_id: 50,
				shoppingcart : {'100': 1},
				discountCode : null
			})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a customer user purchase for other user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchase/admin')
			.send({ 
				billingMethod : 1,
				customer_id: 50,
				shoppingcart : {'100': 1},
				discountCode : null
			})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should let an admin user purchase for other user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchase/admin')
			.send({ 
				billingMethod : 1,
				customer_id: 50,
				shoppingcart : {'100': 1},
				discountCode : null
			})
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.should.be.ok();
				done();
			});
		});
	});

	it("should not let an admin user purchase for other user due to user is supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchase/admin')
			.send({ 
				billingMethod : 1,
				customer_id: 75,
				shoppingcart : {'100': 1},
				discountCode : null
			})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should not let an admin user purchase for other user due to user not found", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchase/admin')
			.send({ 
				billingMethod : 1,
				customer_id: 7484949849849898,
				shoppingcart : {'100': 1},
				discountCode : null
			})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should not let an admin user purchase for other user due to shoppingcart empty", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchase/admin')
			.send({ 
				billingMethod : 1,
				customer_id: 50,
				shoppingcart : {},
				discountCode : null
			})
			.end(function (err, res) {
				res.status.should.be.equal(503);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should not let an admin user purchase for other user due to shoppingcart null", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchase/admin')
			.send({ 
				billingMethod : 1,
				customer_id: 50,
				discountCode : null
			})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should not let an admin user purchase for other user due to billingMethod null", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/purchase/admin')
			.send({ 
				customer_id: 50,
				shoppingcart : {'100': 1},
				discountCode : null
			})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

});