var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('My profile page', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user view its credit card", function (done) {
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/mycreditcard')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				done();
			});
		});
	});

	it("should let a customer view its credit card", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			should.not.exist(err);

			browser
			.get('http://localhost:3000/api/mycreditcard')
			.end(function (err, res) {
				should.not.exist(err);
				
				res.status.should.be.equal(200);
				should.exist(res.body.number);

				done();
			});
		});
	});

	it("should let an admin view a credit card", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			should.not.exist(err);

			browser
			.get('http://localhost:3000/api/creditcard/1')
			.end(function (err, res) {
				should.not.exist(err);
				
				res.status.should.be.equal(200);
				should.exist(res.body.number);

				done();
			});
		});
	});

});