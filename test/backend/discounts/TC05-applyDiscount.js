var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe('Discount management api', function () {
	var browser = request.agent();
	var max = 40,
		min = 0;
	var random_discount_id = Math.floor(Math.random()*(max-min+1)+min);

	it("shouldn't apply a discount to a product due to not authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/apply')
			.send({product_id: 1681, discount_id: 5})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't apply a discount to a product due to customer user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/apply')
			.send({product_id: 1681, discount_id: 5})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't apply a discount to a product due to supplier user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/apply')
			.send({product_id: 1681, discount_id: 5})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should apply a discount to a product", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/apply')
			.send({product_id: 1681, discount_id: random_discount_id})
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.success.should.be.exactly(true);
				done();
			});
		});
	});

	it("shouldn't apply a discount to a product due to already applied", function (done){
		// EXPECT EXECUTE THIS AFTER PREVIOUS TEST
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/apply')
			.send({product_id: 1681, discount_id: random_discount_id})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't clear a discount of a product due to not authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/clear')
			.send({product_id: 1681, discount_id: random_discount_id})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't clear a discount of a product due to customer user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/clear')
			.send({product_id: 1681, discount_id: random_discount_id})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't clear a discount of a product due to supplier user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/clear')
			.send({product_id: 1681, discount_id: random_discount_id})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should clear a discount of a product", function (done){
		// EXPECT EXECUTE THIS AFTER PREVIOUS TEST
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/clear')
			.send({product_id: 1681, discount_id: random_discount_id})
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.success.should.be.exactly(true);
				done();
			});
		});
	});

});