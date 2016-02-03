var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Remove purchasing rule', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user delete purchasing rules", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.del('http://localhost:3000/api/purchasingrule')
			.send({id : 1})
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a supplier delete purchasing rules", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.del('http://localhost:3000/api/purchasingrule')
			.send({id : 1})
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a customer delete other's customer purchasing rule ", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/mypurchasingrules')
			.end(function (err, res) {
				var rule = res.body[0];

				browser
				.post('http://localhost:3000/api/signin')
				.send( { email : 'salvador.saez@example.com', password : 'customer' } )
				.end(function (err, res) {
					browser
					.del('http://localhost:3000/api/purchasingrule')
					.send({id : rule._id})
					.end(function (err, res) {
						res.status.should.be.equal(403);

						done();
					});
				});
			});
		});
	});

	it("should let a customer delete an owned purchasing rule ", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/mypurchasingrules')
			.end(function (err, res) {
				var rule = res.body[res.body.length - 1];

				browser
				.del('http://localhost:3000/api/purchasingrule')
				.send({id : rule._id})
				.end(function (err, res) {
					res.status.should.be.equal(200);

					done();
				});
			});
		});
	});


	//TODO
	/*it("should let an admin delete a purchasing rule ", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.del('http://localhost:3000/api/purchasingrule')
			//TODO: Get one from the all purchasing rules list
			.send({id : 1})
			.end(function (err, res) {
				res.status.should.be.equal(200);

				done();
			});
		});
	});*/
});