var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('My profile page', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user view its profile", function (done) {
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/myprofile')
			.end(function (err, res) {
				res.status.should.be.equal(401);
				done();
			});
		});
	});

	it("should let a user view its profile", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			should.not.exist(err);

			browser
			.get('http://localhost:3000/api/myprofile')
			.end(function (err, res) {
				should.not.exist(err);
				
				res.status.should.be.equal(200);
				res.body.email.should.be.equal("ismael.perez@example.com");

				done();
			});
		});
	});

});