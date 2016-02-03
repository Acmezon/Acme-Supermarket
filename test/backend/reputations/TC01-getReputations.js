var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Reputation api', function () {
	var browser = request.agent();

	it("shouldn't let a not authenticated user get his reputations", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/reputations/byprovide/1')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let an admin get his reputations", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/reputations/byprovide/1')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let a customer get his reputations", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/reputations/byprovide/1')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	//Supplier with no reputations
	it("shouldn't let a supplier get others suppliers reputation", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'no.provides@mail.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/reputations/byprovide/1')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("should let suppliers get their reputation", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/products/myproducts/filtered')
			.end(function (err, res) {
				var product = res.body[0];

				browser
				.get('http://localhost:3000/api/provide/bysupplier/byproduct/' + product._id)
				.end(function (err, res) {
						var provide_id = res.body._id;

					browser
					.get('http://localhost:3000/api/reputations/byprovide/' + provide_id)
					.end(function (err, res) {
						res.status.should.be.equal(200);

						done();
					});
				});
			});
		});
	});

});