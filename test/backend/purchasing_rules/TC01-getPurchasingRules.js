var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe('Load purchasing rules', function () {
	var browser = request.agent();

	it("shouldn't let an anonymous user get purchasing rules", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/mypurchasingrules')
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a supplier get purchasing rules", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/mypurchasingrules')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let an admin get 'my' purchasing rules", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/mypurchasingrules')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("should let customers get theirs purchasing rules", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/mypurchasingrules')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				res.body.length.should.be.above(0);

				done();
			});
		});
		
	});

	it("shouldn't let an anonymous user get all purchasing rules", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchasingrules/filtered')
			.send({sort: 'customer_id'})
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a supplier get all purchasing rules", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchasingrules/filtered')
			.send({sort: 'customer_id'})
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let a customers get all purchasing rules", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchasingrules/filtered')
			.send({sort: 'customer_id'})
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
		
	});

	it("should let an admin get all purchasing rules", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchasingrules/filtered')
			.send({sort: 'customer_id'})
			.end(function (err, res) {
				res.status.should.be.equal(200);

				res.body.length.should.be.above(0);

				done();
			});
		});
	});

	it("shouldn't let an anonymous user get all purchasing rules count", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchasingrules/filtered/count')
			.end(function (err, res) {
				res.status.should.be.equal(401);

				done();
			});
		});
	});

	it("shouldn't let a supplier get all purchasing rules count", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'ismael.perez@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchasingrules/filtered/count')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
	});

	it("shouldn't let a customers get all purchasing rules count", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchasingrules/filtered/count')
			.end(function (err, res) {
				res.status.should.be.equal(403);

				done();
			});
		});
		
	});

	it("should let an admin get all purchasing rules count", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.post('http://localhost:3000/api/purchasingrules/filtered/count')
			.end(function (err, res) {
				res.status.should.be.equal(200);

				res.body.should.be.above(0);

				done();
			});
		});
	});
});