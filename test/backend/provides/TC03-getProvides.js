var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Provides API', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user get a provide by ID", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/provide/1')
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a user get a provide by ID", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/provide/1')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				
				done();
			});
		});
	});
});