var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe('Discount management api', function () {
	var browser = request.agent();

	it("shouldn't respond if discount is applied to product to a not authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/canredeem')
			.send({product_id: 1681, code: 'FFAE-DFJM-PR86-FHDH'})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't respond if discount is applied to product to a supplier user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/canredeem')
			.send({product_id: 1681, code: 'FFAE-DFJM-PR86-FHDH'})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should respond if discount is applied to product to a customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/canredeem')
			.send({product_id: 1681, code: 'FFAE-DFJM-PR86-FHDH'})
			.end(function (err, res) {
				res.status.should.be.equal(200);
				done();
			});
		});
	});

	it("should respond if discount is applied to product to an admin", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/discount/canredeem')
			.send({product_id: 1681, code: 'FFAE-DFJM-PR86-FHDH'})
			.end(function (err, res) {
				res.status.should.be.equal(200);
				done();
			});
		});
	});

});