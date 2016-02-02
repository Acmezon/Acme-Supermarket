var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Product delete', function () {
	var product_name = '0000AAA';
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
		.get("http://localhost:3000/api/products/limit/" + 30)
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {
					browser
					.post('http://localhost:3000/api/signin')
					.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
					.end(function (err, res) {
						browser
						.delete('http://localhost:3000/api/products/' + product._id)
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
		.get("http://localhost:3000/api/products/limit/" + 30)
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {
					browser
					.post('http://localhost:3000/api/signin')
					.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
					.end(function (err, res) {
						browser
						.delete('http://localhost:3000/api/products/' + product._id)
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
		.get("http://localhost:3000/api/products/limit/" + 30)
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {
					browser
					.get('http://localhost:3000/api/signout')
					.end(function (err, res) {
						browser
						.delete('http://localhost:3000/api/products/' + product._id)
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
		.get("http://localhost:3000/api/products/limit/" + 30)
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {					
					browser
					.delete('http://localhost:3000/api/products/999999')
					.end(function (err, res) {
						res.status.should.be.equal(404);
						done();
					});
				}
			}
		});
	});

	it('shouldn\'t let the admin delete an product due missing product ID in request', function (done){
		browser
		.get("http://localhost:3000/api/products/limit/" + 30)
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {					
					browser
					.delete('http://localhost:3000/api/products/')
					.end(function (err, res) {
						res.status.should.be.equal(500);
						done();
					});
				}
			}
		});
	});

	it('should let the admin delete a product', function (done){
		browser
		.get("http://localhost:3000/api/products/limit/" + 30)
		.end(function (err, res){
			res.status.should.be.equal(200);

			var L = res.body.length;

			for(var i = 0; i < L; i++) {
				var product = res.body[i];
				if(product.name == product_name) {					
					browser
					.delete('http://localhost:3000/api/products/' + product._id)
					.end(function (err, res) {
						res.status.should.be.equal(200);
						done();
					});
				}
			}
		});
	});
});