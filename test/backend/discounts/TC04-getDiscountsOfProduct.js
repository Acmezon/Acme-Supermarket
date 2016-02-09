var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe('Discount management api', function () {
	var browser = request.agent();

	it("shouldn't get the discounts of a product due to not authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			product_id = 1681;

			browser
			.get('http://localhost:3000/api/discounts/ofproduct/'+product_id)
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't get the discounts of a product due to customer user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			product_id = 1681;

			browser
			.get('http://localhost:3000/api/discounts/ofproduct/'+product_id)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't get the discounts of a product due to supplier user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {

			product_id = 1681;

			browser
			.get('http://localhost:3000/api/discounts/ofproduct/'+product_id)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should the discounts of a product", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			product_id = 1681;

			browser
			.get('http://localhost:3000/api/discounts/ofproduct/'+product_id)
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.should.be.ok();
				done();
			});
		});
	});

	

});