var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe('Discount management api', function () {
	var browser = request.agent();

	it("shouldn't edit a discount due to not authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			var discount = {
				discount_id: 10,
				value: 50
			};

			browser
			.post('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't edit a discount due to customer user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			var discount = {
				discount_id: 10,
				value: 50
			};
			
			browser
			.post('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't edit a discount due to supplier user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {

			var discount = {
				discount_id: 10,
				value: 50
			};
			
			browser
			.post('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't edit a discount due empty value", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var discount = {
				discount_id: 10
			};
			
			browser
			.post('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't edit a discount due wrong value - lower", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var discount = {
				discount_id: 10,
				value: -1
			};
			
			browser
			.post('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't edit a discount due wrong value - higher", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var discount = {
				discount_id: 10,
				value: 1000
			};
			
			browser
			.post('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should edit a discount", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var discount = {
				discount_id: 10,
				value: 50
			};
			
			browser
			.post('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.success.should.be.exactly(true);
				done();
			});
		});
	});

	it("shouldn't remove a discount due to not authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.del('http://localhost:3000/api/discount')
			.send({id : 10})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});

		});
	});

	it("shouldn't remove a discount due to customer user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			var discount = {
				id: 10
			};
			
			browser
			.del('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't remove a discount due to supplier user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {

			var discount = {
				id: 10
			};
			
			browser
			.del('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should remove a discount", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var discount = {
				id: 11
			};
			
			browser
			.del('http://localhost:3000/api/discount')
			.send(discount)
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.success.should.be.exactly(true);
				done();
			});
		});
	});

});