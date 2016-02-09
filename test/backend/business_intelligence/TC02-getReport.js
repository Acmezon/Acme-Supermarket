var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe('Sales report api', function () {
	var browser = request.agent();

	it("shouldn't load sales reports to a non-authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/bi/getReport')
			.send({year: 2015, supplier_email: 'ismael.perez@example.com'})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load sales reports to a customer user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/bi/getReport')
			.send({year: 2015, supplier_email: 'ismael.perez@example.com'})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load sales reports to a supplier user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/bi/getReport')
			.send({year: 2015, supplier_email: 'ismael.perez@example.com'})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load sales reports to an administrator due to supplier not found", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/bi/getReport')
			.send({year: 2015, supplier_email: 'wrongemail'})
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load sales reports to an administrator due to wrong year", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/bi/getReport')
			.send({year: 1555520, supplier_email: 'ismael.perez@example.com'})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load sales reports to an administrator due year null", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/bi/getReport')
			.send({supplier_email: 'ismael.perez@example.com'})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load sales reports to an administrator due email null", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/bi/getReport')
			.send({year: 2015})
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should load sales reports to an administrator", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/bi/getReport')
			.send({year: 2015, supplier_email: 'ismael.perez@example.com'})
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.success.should.be.exactly(true);
				res.body.url.should.be.ok();
				done();
			});
		});
	});

	
});