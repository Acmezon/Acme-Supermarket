var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Get notifications from the API", function (){
	var browser = request.agent();

	it("shouldn't get notifications due to non-authenticated used", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/notifications/1')
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't get notifications due to customer used", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/notifications/1')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't get notifications due to supplier used", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/notifications/1')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should get notifications", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/notifications/1')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.should.be.ok();
				done();
			});
		});
	});



	
});