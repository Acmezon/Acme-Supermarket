var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Edit product rate API url", function (){
	var browser = request.agent();
	var product_name = "000000000000000AAA";

	beforeEach(function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			done();
		});
	});

	it("should't let an anonymous user edit a product rate", function (done){
		browser
		.post("http://localhost:3000/api/products/filtered")
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {
					var product_id = product._id;

					browser
					.get('http://localhost:3000/api/signout')
					.end(function (err, res) {
						browser
						.post('http://localhost:3000/api/product/updateProductRating')
						.send({ id : product_id, rating : 1})
						.end(function (err, res) {
							res.status.should.be.equal(403);
							res.body.success.should.be.false;
							done();
						});
					});
				}
			}
		});
	});

	it("should't let customer edit a product rate due to not have purchased it", function (done){
		browser
		.post("http://localhost:3000/api/products/filtered")
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {
					var product_id = product._id;

					browser
					.post('http://localhost:3000/api/signin')
					.send({ email : 'alex.gallardo@example.com', password: 'customer'})
					.end(function (err, res) {
						browser
						.post('http://localhost:3000/api/product/updateProductRating')
						.send({ id : product_id, rating : 1})
						.end(function (err, res) {
							res.status.should.be.equal(401);
							done();
						});
					});
				}
			}
		});
	});

	it("should't let a supplier edit a product rate", function (done){
		browser
		.post("http://localhost:3000/api/products/filtered")
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {
					var product_id = product._id;

					browser
					.post('http://localhost:3000/api/signin')
					.send({ email : 'ismael.perez@example.com', password: 'supplier'})
					.end(function (err, res) {
						browser
						.post('http://localhost:3000/api/product/updateProductRating')
						.send({ id : product_id, rating : 1})
						.end(function (err, res) {
							res.status.should.be.equal(403);
							done();
						});
					});
				}
			}
		});
	});

	it("should't let an admin edit a product rate", function (done){
		browser
		.post("http://localhost:3000/api/products/filtered")
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {
					var product_id = product._id;

					browser
					.post('http://localhost:3000/api/product/updateProductRating')
					.send({ id : product_id, rating : 1})
					.end(function (err, res) {
						res.status.should.be.equal(403);
						done();
					});
				}
			}
		});
	});

	it("should let a customer rate a purchased product", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send({ email : 'alex.gallardo@example.com', password: 'customer'})
		.end(function (err, res) {
			browser
			.post("http://localhost:3000/api/purchases/mypurchases/filtered")
			.end(function (err, res){
				var purchase = res.body[0];

				browser
				.get("http://localhost:3000/api/purchaselines/bypurchase/" + purchase._id)
				.end(function (err, res) {
					var purchase_line = res.body[0];

					browser
					.get("http://localhost:3000/api/provide/" + purchase_line.provide_id)
					.end(function (err, res) {
						var product_id = res.body.product_id;

						browser
						.post('http://localhost:3000/api/product/updateProductRating')
						.send({ id : product_id, rating : 1})
						.end(function (err, res) {
							res.status.should.be.equal(200);

							done();
						});
					});
				});
			});
		});
	});
});