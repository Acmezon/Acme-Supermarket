var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Load products', function () {
	var browser = request.agent();
	
	beforeEach(function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			should.not.exist(err);

			done();
		});
	});

	it("shouldn't return product details due to non authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get("http://localhost:3000/api/products/limit/" + 1)
			.end(function (err, res){
				should.not.exist(err);

				res.status.should.be.equal(200);

				var product = res.body[0];

				browser
				.get("http://localhost:3000/api/product/" + product._id)
				.end(function (err, res){
					res.status.should.be.equal(401);
					res.body.success.should.be.false;
					done();
				});
			});
		});
	});

	it("should return product details to admin", function (done){
		browser
		.get("http://localhost:3000/api/products/limit/" + 1)
		.end(function (err, res){
			should.not.exist(err);

			res.status.should.be.equal(200);

			var product = res.body[0];

			browser
			.get("http://localhost:3000/api/product/" + product._id)
			.end(function (err, res){
				should.not.exist(err);

				res.status.should.be.equal(200);
				res.body.name.should.be.equal(product.name);
				done();
			});
		});
	});

	it("should return product details to customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get("http://localhost:3000/api/products/limit/" + 1)
			.end(function (err, res){
				should.not.exist(err);

				res.status.should.be.equal(200);

				var product = res.body[0];

				browser
				.get("http://localhost:3000/api/product/" + product._id)
				.end(function (err, res){
					should.not.exist(err);

					res.status.should.be.equal(200);
					res.body.name.should.be.equal(product.name);
					done();
				});
			});
		});
	});

	it("should return product details to supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get("http://localhost:3000/api/products/limit/" + 1)
			.end(function (err, res){
				should.not.exist(err);

				res.status.should.be.equal(200);

				var product = res.body[0];

				browser
				.get("http://localhost:3000/api/product/" + product._id)
				.end(function (err, res){
					should.not.exist(err);

					res.status.should.be.equal(200);
					res.body.name.should.be.equal(product.name);
					done();
				});
			});
		});
	});

	it("should return true because the user has purchased the product", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchases/mypurchases/filtered')
			.send({ sort: 'paymentDate', order : 1 })
			.end(function (err, res) {
				var purchase = res.body[0];

				browser
				.get('http://localhost:3000/api/purchaselines/bypurchase/' + purchase._id)
				.end(function (err, res) {
					should.not.exist(err);
					res.status.should.be.equal(200);

					var provide_id = res.body[0].provide_id;

					browser
					.get('http://localhost:3000/api/existingProvide/' + provide_id)
					.end(function (err, res) {
						should.not.exist(err);
						res.status.should.be.equal(200);
						
						var product_id = res.body.product_id;

						browser
						.post('http://localhost:3000/api/product/userHasPurchased')
						.send({ product: product_id })
						.end(function (err, res) {
							res.status.should.be.equal(200);

							res.body.hasPurchased.should.be.true;
							done();
						});
					});
				});
			});
		});
	});
	
	it("should get product rating", function (done){
		browser
		.get("http://localhost:3000/api/averageRatingByProductId/" + 1)
		.end(function (err, res){
			res.status.should.be.equal(200);

			done();
		});
	});
});