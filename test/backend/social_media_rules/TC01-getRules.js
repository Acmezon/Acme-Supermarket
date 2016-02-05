var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Management Social Media Rules API", function (){
	var browser = request.agent();

	it("shouldn't load social media rules to a non-authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/socialmediarules/')
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load social media rules to a customer user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/socialmediarules/')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load social media rules to a supplier user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/socialmediarules/')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't load social media rules to an admin user", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/socialmediarules/')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.should.be.ok();
				done();
			});
		});
	});
});