var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Management Social Media Rules API", function (){
	var browser = request.agent();

	it("shouldn't let a non-authenticated user create a social media rule", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			var rule = {increaseRate: 50, product_id: 50};

			browser
			.post('http://localhost:3000/api/productrule/create')
			.send({rule: rule})
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a customer user create a social media rule", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			var rule = {increaseRate: 50, product_id: 50};

			browser
			.post('http://localhost:3000/api/productrule/create')
			.send({rule: rule})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let a supplier user create a social media rule", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {

			var rule = {increaseRate: 50, product_id: 50};

			browser
			.post('http://localhost:3000/api/productrule/create')
			.send({rule: rule})
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't let an admin user create a social media rule due to rule not set", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.post('http://localhost:3000/api/productrule/create')
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should let an admin user create a social media rule", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var rule = {increaseRate: 50, product_id: 50};

			browser
			.post('http://localhost:3000/api/productrule/create')
			.send({rule: rule})
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.success.should.be.exactly(true);
				done();
			});
		});
	});
});