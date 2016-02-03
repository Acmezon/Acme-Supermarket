var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Product delete', function () {
	var product_name = "000000000000000AAA";
	var browser = request.agent();

	beforeEach(function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			done();
		});
	});
	
	it('shouldn\'t let a customer delete a product', function (done) {
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
					.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
					.end(function (err, res) {
						browser
						.del('http://localhost:3000/api/products/' + product_id)
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

	it('shouldn\'t let a supplier delete a product', function (done) {
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
					.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
					.end(function (err, res) {
						browser
						.del('http://localhost:3000/api/products/' + product_id)
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

	it('shouldn\'t let an anonymous user delete a product', function (done) {
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
						.del('http://localhost:3000/api/products/' + product_id)
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

	it('shouldn\'t let the admin delete an unexisting product', function (done){
		browser
		.post("http://localhost:3000/api/products/filtered")
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {	

					browser
					.del('http://localhost:3000/api/products/999999')
					.end(function (err, res) {
						res.status.should.be.equal(404);
						done();
					});
				}
			}
		});
	});

	it('should let the admin delete a product', function (done){
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
					.del('http://localhost:3000/api/products/' + product_id)
					.end(function (err, res) {
						res.status.should.be.equal(200);
						done();
					});
				}
			}
		});
	});
});