var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe('Sales over time api', function () {
	var browser = request.agent();

	it("shouldn't load sales over time to a non-authenticated user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/byemail/no.provides@mail.com')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				
				browser
				.get('http://localhost:3000/api/signout')
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/bi/getSalesOverTime/' + res.body._id)
					.end(function (err, res) {
						res.status.should.be.equal(401);
						res.body.success.should.be.exactly(false);
						done();
					});
				});
			});
		});
	});

	it("shouldn't load sales over time to a customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/byemail/no.provides@mail.com')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				
				browser
				.post('http://localhost:3000/api/signin')
				.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/bi/getSalesOverTime/' + res.body._id)
					.end(function (err, res) {
						res.status.should.be.equal(403);
						res.body.success.should.be.exactly(false);
						done();
					});
				});
			});
		});
	});

	it("shouldn't load sales over time to a supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/byemail/no.provides@mail.com')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				
				browser
				.post('http://localhost:3000/api/signin')
				.send( { email : 'german.cruz@example.com', password : 'supplier' } )
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/bi/getSalesOverTime/' + res.body._id)
					.end(function (err, res) {
						res.status.should.be.equal(403);
						res.body.success.should.be.exactly(false);
						done();
					});
				});
			});
		});
	});

	it('should load sales over time', function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/byemail/no.provides@mail.com')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				
				browser
				.post('http://localhost:3000/api/signin')
				.send( { email : 'admin@mail.com', password : 'administrator' } )
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/bi/getSalesOverTime/' + res.body._id)
					.end(function (err, res) {
						res.status.should.be.equal(200);
						
						done();
					});
				});
			});
		});
	});
});