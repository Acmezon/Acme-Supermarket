var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Get Info from Social Media API", function (){
	var browser = request.agent();

	it("shouldn't load social media info to a non-authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/status')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				
				done();
			});
		});
	});

	it("shouldn't load social media info to a customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/status')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				
				done();
			});
		});
	});


	it("shouldn't load social media info to a supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/status')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				
				done();
			});
		});
	});


	it('should load social media info', function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/status')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				should.exist(res.body.running);
				done();
			});
		});
	});
});