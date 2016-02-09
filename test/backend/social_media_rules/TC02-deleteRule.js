var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Management Social Media Rules API", function (){
	var browser = request.agent();

	it("shouldn't let a non-authenticated user delete a social media rule", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.delete('http://localhost:3000/api/socialmediarules/delete/3')
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a customer user delete a social media rule", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.delete('http://localhost:3000/api/socialmediarules/delete/3')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a supplier user delete a social media rule", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.delete('http://localhost:3000/api/socialmediarules/delete/3')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let an admin user delete a social media rule due to rule id not set", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.delete('http://localhost:3000/api/socialmediarules/delete/')
			.end(function (err, res) {
				res.status.should.be.equal(404);
				done();
			});
		});
	});

	it("should let an admin user delete a social media rule", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.delete('http://localhost:3000/api/socialmediarules/delete/3')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.success.should.be.exactly(true);
				done();
			});
		});
	});
});