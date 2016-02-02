var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Edit product API url", function (){
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

	it("should let an admin edit a product", function (done){
		browser
		.post("http://localhost:3000/api/products/filtered")
		.end(function (err, res){
			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				console.log(product.name);

				if(product.name == product_name) {
					var description = 'This is the new description';

					browser
					.post("http://localhost:3000/api/product/updateProduct")
					.send({ field: 'description', data: description })
					.end(function (err, res){
						browser
						.get("http://localhost:3000/api/product/" + product._id)
						.end(function (err, res){
							res.status.should.be.equal(200);
							res.body.description.should.be.equal(description);
							done();
						});
					});
				}
			}
		});
	});

	it("shouln't let a non-authenticated user edit a product", function (done) {
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post("http://localhost:3000/api/products/filtered")
			.end(function (err, res){
				res.status.should.be.equal(200);

				var product = res.body[0];
				product.name = "This is the new name";

				browser
				.post("http://localhost:3000/api/product/updateProduct")
				.send(product)
				.end(function (err, res){
					res.status.should.be.equal(403);
					res.body.success.should.be.false;
					done();
				});
			});
		});
	});

	it("shouln't let a customer edit a product", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send({ email: 'alex.gallardo@example.com', password: 'customer' })
		.end(function (err, res) {
			browser
			.post("http://localhost:3000/api/products/filtered")
			.end(function (err, res){
				res.status.should.be.equal(200);

				var product = res.body[0];
				product.name = "This is the new name";

				browser
				.post("http://localhost:3000/api/product/updateProduct")
				.send(product)
				.end(function (err, res){
					res.status.should.be.equal(403);
					res.body.success.should.be.false;
					done();
				});
			});
		});
	});

	it("shouln't let a supplier edit a product", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send({ email: 'ismael.perez@example.com', password: 'supplier' })
		.end(function (err, res) {
			browser
			.post("http://localhost:3000/api/products/filtered")
			.end(function (err, res){
				res.status.should.be.equal(200);

				var product = res.body[0];
				product.name = "This is the new name";

				browser
				.post("http://localhost:3000/api/product/updateProduct")
				.send(product)
				.end(function (err, res){
					res.status.should.be.equal(403);
					res.body.success.should.be.false;
					done();
				});
			});
		});
	});
});