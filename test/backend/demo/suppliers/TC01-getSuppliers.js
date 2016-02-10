var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe('Customers management api', function () {
	var browser = request.agent();

	it("should load the currently logged supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/principal')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				res.body.email.should.be.equal('german.cruz@example.com');
				done();
			});
		});
	});

	it("shouldn't load the supplier name to a non-authenticated user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res){
			browser
			.get('http://localhost:3000/api/supplier/principal')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				var name = res.body.name;
				var id = res.body._id;

				browser
				.get('http://localhost:3000/api/signout')
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/supplierName/' + id)
					.end(function (err, res) {
						res.status.should.be.equal(401);

						res.body.success.should.be.exactly(false);
						done();
					});
				});
			});
		});
	});

	it("should load the supplier name to a user user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/principal')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				var name = res.body.name;
				var id = res.body._id;

				browser
				.post('http://localhost:3000/api/signin')
				.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/supplierName/' + id)
					.end(function (err, res) {
						res.status.should.be.equal(200);
						
						res.body.should.be.equal(name);
						done();
					});
				});
			});
		});
	});

	it("shouldn't load a supplier by email to a non-authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/byemail/no.provides@mail.com')
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load a supplier by email to a customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/byemail/no.provides@mail.com')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load a supplier by email to a supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/byemail/no.provides@mail.com')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it('should load a supplier by email', function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/byemail/no.provides@mail.com')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				
				done();
			});
		});
	});
});