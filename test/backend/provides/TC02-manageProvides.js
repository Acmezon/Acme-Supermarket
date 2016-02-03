var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Product details page', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user provide a product", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/supplier/provideProduct')
			.send({ product_id : 1, price: '12.0'})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				done();
			});
		});
	});

	it("shouldn't let a customer provide a product", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/supplier/provideProduct')
			.send({ product_id : 1, price: '12.0'})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				done();
			});
		});
	});

	it("shouldn't let a admin provide a product", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/supplier/provideProduct')
			.send({ product_id : 1, price: '12.0'})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				done();
			});
		});
	});;

	//Supplier with no provides yet.
	it('should let the supplier provide the product', function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'no.provides@mail.com', password : 'supplier' } )
		.end(function (err, res) {
			should.not.exist(err);

			browser
			.post("http://localhost:3000/api/products/filtered")
			.end(function (err, res){
				var product = res.body[0];

				browser
				.post('http://localhost:3000/api/supplier/provideProduct')
				.send({ product_id : product._id, price: '12.0'})
				.end(function (err, res) {
					res.status.should.be.equal(200);
					done();
				});
			});
		});
	});

	it('shouldn\'t let a customer remove the provide from a product', function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			should.not.exist(err);
			
			browser
			.post('http://localhost:3000/api/products/myproducts/filtered')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				var product = res.body[0];

				browser
				.post('http://localhost:3000/api/signin')
				.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
				.end(function (err, res) {
					browser
					.delete('http://localhost:3000/api/provide/bysupplier/byproduct/' + product._id)
					.end(function (err, res) {

						res.status.should.be.equal(403);
						res.body.success.should.be.false;
					});

					done();
				});
			});
		});
	});

	it('shouldn\'t let an admin remove the provide from a product', function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			should.not.exist(err);
			
			browser
			.post('http://localhost:3000/api/products/myproducts/filtered')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				var product = res.body[0];

				browser
				.post('http://localhost:3000/api/signin')
				.send( { email : 'admin@mail.com', password : 'administrator' } )
				.end(function (err, res) {
					browser
					.delete('http://localhost:3000/api/provide/bysupplier/byproduct/' + product._id)
					.end(function (err, res) {

						res.status.should.be.equal(403);
						res.body.success.should.be.false;
					});

					done();
				});
			});
		});
	});

	//Special user with just one provide
	it('should let the supplier remove the provide from the product', function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'no.provides@mail.com', password : 'supplier' } )
		.end(function (err, res) {
			should.not.exist(err);
			
			browser
			.post('http://localhost:3000/api/products/myproducts/filtered')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				var product = res.body[0];

				browser
				.delete('http://localhost:3000/api/provide/bysupplier/byproduct/' + product._id)
				.end(function (err, res) {
					should.not.exist(err);

					res.status.should.be.equal(200);
					res.body.success.should.be.true;
				});

				done();
			});
		});
	});
});