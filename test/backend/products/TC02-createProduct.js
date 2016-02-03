var request = require('superagent');
var should = require('should');
var assert = require('assert');
var path = require('path');

describe('Product creation', function () {
	var browser = request.agent();
	var product_name = "000000000000000AAA";

	it("shouldn't let a customer create a product", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send({ email: 'alex.gallardo@example.com', password: 'customer' })
		.end(function (err, res) {
			var fileToUpload = '../../resources/images/img-thing.jpg',
				absolutePath = path.resolve(__dirname, fileToUpload);

			browser
			.post('http://localhost:3000/api/products/create')
			.field('product[name]', product_name)
			.field('product[description]', 'My test product')
			//.attach('file', absolutePath)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a supplier create a product", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send({ email: 'ismael.perez@example.com', password: 'supplier' })
		.end(function (err, res) {
			var fileToUpload = '../../resources/images/img-thing.jpg',
				absolutePath = path.resolve(__dirname, fileToUpload);

			browser
			.post('http://localhost:3000/api/products/create')
			.field('name', product_name)
			.field('description', 'My test product')
			//.attach('file', absolutePath)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let an anonymous user create a product", function (done) {	
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			var fileToUpload = '../../resources/images/img-thing.jpg',
				absolutePath = path.resolve(__dirname, fileToUpload);

			browser
			.post('http://localhost:3000/api/products/create')
			.field('name', product_name)
			.field('description', 'My test product')
			//.attach('file', absolutePath)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it('should let the admin create a product', function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			var fileToUpload = '../../resources/images/img-thing.jpg',
			absolutePath = path.resolve(__dirname, fileToUpload);

			browser
			.post('http://localhost:3000/api/products/create')
			.field('name', product_name)
			.field('description', 'My test product')
			.attach('file', absolutePath)
			.end(function (err, res) {
				should.not.exist(err);

				res.status.should.be.equal(200);
				done();
			});
		});
	});
});