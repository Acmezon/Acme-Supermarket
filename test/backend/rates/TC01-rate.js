var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Product rating and Provide rating', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user rate", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/product/updateProductRating')
			.send({id : 1, rating: 4})
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});
	
	it("shouldn't let a supplier rate", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/product/updateProductRating')
			.send({id : 1, rating: 4})
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let a admin rate in the customers way", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/product/updateProductRating')
			.send({id : 1, rating: 4})
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	//Customer with no purchases
	it("shouldn't let a customer rate a non purchased product", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'no.purchases@mail.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/product/updateProductRating')
			.send({id : 1, rating: 4})
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a customer rate due to missing parameters in body", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/product/updateProductRating')
			.end(function (err, res) {
				res.status.should.be.equal(500);

				done();
			});
		});
	});

	it("should let a customer rate a purchased product", function (done){
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
						.post('http://localhost:3000/api/product/updateProductRating')
						.send({ id: product_id, rating: 4})
						.end(function (err, res) {
							should.not.exist(err);

							res.status.should.be.equal(200);

							done();
						});
					});
				});
			});
		});
	});

	it("shouldn't let an anonymous user rate a provide", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/provide/updateProvideRating')
			.send({provide_id : 1, rating: 4})
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let a supplier rate a provide", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/provide/updateProvideRating')
			.send({provide_id : 1, rating: 4})
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let a admin rate a provide in the customers way", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/provide/updateProvideRating')
			.send({provide_id : 1, rating: 4})
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	//Customer with no purchases
	it("shouldn't let a customer rate a provide from a non purchased product", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'no.purchases@mail.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/provide/updateProvideRating')
			.send({provide_id : 6000, rating: 4})
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a customer rate a provide due to missing parameters in body", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/provide/updateProvideRating')
			.end(function (err, res) {
				res.status.should.be.equal(500);

				done();
			});
		});
	});

	it("should let a customer rate a provide from a purchased product", function (done){
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
					.post('http://localhost:3000/api/provide/updateProvideRating')
					.send({provide_id : provide_id, rating: 4})
					.end(function (err, res) {
						should.not.exist(err);

						res.status.should.be.equal(200);

						done();
					});
				});
			});
		});
	});
});