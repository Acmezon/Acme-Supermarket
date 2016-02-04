var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Reputation API', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user get a suppier reputation", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/principal')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				var name = res.body.name;
				var id = res.body._id;

				browser
				.get('http://localhost:3000/api/signout')
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/averageReputationBySupplierId/' + id)
					.end(function (err, res) {
						res.status.should.be.equal(401);

						done();
					});
				});
			});
		})
	});
	
	it("should let a user get a suppier reputation", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/supplier/principal')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				var name = res.body.name;
				var id = res.body._id;

				browser
				.post('http://localhost:3000/api/signin')
				.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
				.end(function (err, res) {
					browser
					.get('http://localhost:3000/api/averageReputationBySupplierId/' + id)
					.end(function (err, res) {
						should.not.exist(err);
						res.status.should.be.equal(200);

						done();
					});
				});
			});
		})
	});
});