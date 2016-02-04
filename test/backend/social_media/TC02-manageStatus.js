var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Manage status from Social Media API", function (){
	var browser = request.agent();

	it("shouldn't let start twitter scrapper to a non-authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/start')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				
				done();
			});
		});
	});

	it("shouldn't let start twitter scrapper to a customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/start')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				
				done();
			});
		});
	});


	it("shouldn't let start twitter scrapper to a supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/start')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				
				done();
			});
		});
	});

	it("shouldn't let stop twitter scrapper to a non-authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/stop')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				
				done();
			});
		});
	});

	it("shouldn't let stop twitter scrapper to a customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/stop')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				
				done();
			});
		});
	});


	it("shouldn't let stop twitter scrapper to a supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/socialMedia/stop')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				
				done();
			});
		});
	});
});