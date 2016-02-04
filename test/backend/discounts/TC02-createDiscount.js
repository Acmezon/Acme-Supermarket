var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe('Discount management api', function () {
	var browser = request.agent();

	it("shouldn't generate a discount code to a non-authenticated user", function (done){
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/generatecode')
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't generate a discount code to a customer", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/generatecode')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't generate a discount code to a supplier", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/generatecode')
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it('should generate a discount code to an admin', function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			browser
			.get('http://localhost:3000/api/generatecode')
			.end(function (err, res) {
				res.status.should.be.equal(200);
				res.body.should.be.ok();
				res.body.length.should.be.above(0);
				done();
			});
		});
	});

	it("shouldn't create a discount due to not authenticated user", function (done) {
		browser
		.get('http://localhost:3000/api/signout')
		.end(function (err, res) {

			var newDiscount = {
				code: 'W5PQ-PYN2-B8B4-6HH2',
				value: 10
			};

			browser
			.post('http://localhost:3000/api/discount/create')
			.send(newDiscount)
			.end(function (err, res) {
				res.status.should.be.equal(401);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't create a discount due to customer user", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'alex.gallardo@example.com', password : 'customer' } )
		.end(function (err, res) {

			var newDiscount = {
				code: 'W5PQ-PYN2-B8B4-6HH2',
				value: 10
			};

			browser
			.post('http://localhost:3000/api/discount/create')
			.send(newDiscount)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't create a discount due to supplier user", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'german.cruz@example.com', password : 'supplier' } )
		.end(function (err, res) {

			var newDiscount = {
				code: 'W5PQ-PYN2-B8B4-6HH2',
				value: 10
			};

			browser
			.post('http://localhost:3000/api/discount/create')
			.send(newDiscount)
			.end(function (err, res) {
				res.status.should.be.equal(403);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't create a discount due to wrong format code", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var newDiscount = {
				code: '123',
				value: 10
			};

			browser
			.post('http://localhost:3000/api/discount/create')
			.send(newDiscount)
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't create a discount due to empty code", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var newDiscount = {
				value: 10
			};

			browser
			.post('http://localhost:3000/api/discount/create')
			.send(newDiscount)
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't create a discount due to value - higher", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var newDiscount = {
				code: 'W5PQ-PYN2-B8B4-6HH2',
				value: 1100
			};

			browser
			.post('http://localhost:3000/api/discount/create')
			.send(newDiscount)
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't create a discount due to value - lower", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var newDiscount = {
				code: 'W5PQ-PYN2-B8B4-6HH2',
				value: -10
			};

			browser
			.post('http://localhost:3000/api/discount/create')
			.send(newDiscount)
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("shouldn't create a discount due to empty value", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			var newDiscount = {
				code: 'W5PQ-PYN2-B8B4-6HH2'
			};

			browser
			.post('http://localhost:3000/api/discount/create')
			.send(newDiscount)
			.end(function (err, res) {
				res.status.should.be.equal(500);
				res.body.success.should.be.exactly(false);
				done();
			});
		});
	});

	it("should create a discount", function (done) {
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {

			browser
			.get('http://localhost:3000/api/generatecode')
			.end(function (err, res) {
				var code = res.body;

				var newDiscount = {
					code: code,
					value : 10
				};

				browser
				.post('http://localhost:3000/api/discount/create')
				.send(newDiscount)
				.end(function (err, res) {
					res.status.should.be.equal(200);
					res.body.should.be.ok();
					res.body.code.should.be.exactly(code);
					res.body.value.should.be.exactly(10);
					done();
				});
			});	
		});
	});

});