var should = require('should'),
	assert = require('assert'),
	request = require('superagent');

describe("Post a customer to the API", function (){
	var browser = request.agent();

	it("should create a new entry in the customers collection", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'randmail@mail.com',
			password : 'customer',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(200);
			res.body.success.should.be.exactly(true);
			done();
		});
	});

	it(" should not create a customer due to existing email", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'randmail@mail.com',
			password : 'password',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it(" should not create a customer due to invalid value on phone", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'pablo@email.com',
			password : 'password',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '11111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it("should not create a customer due to missing field (name)", function (done){
		var customer = {
			surname : 'Doe',
			email : 'newmail@mail.com',
			password : 'customer',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it("should not create a customer due to missing field (surname)", function (done){
		var customer = {
			name : 'John',
			email : 'newmail@mail.com',
			password : 'customer',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it("should not create a customer due to missing field (email)", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			password : 'customer',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it("should not create a customer due to missing field (password)", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'newmail@mail.com',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it("should not create a customer due to missing field (coordinates)", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'newmail@mail.com',
			password : 'customer',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});
	
	it("should not create a customer due to missing field (address)", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'newmail@mail.com',
			password : 'customer',
			coordinates : '12.3214;21.1230',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it("should not create a customer due to missing field (country)", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'newmail@mail.com',
			password : 'customer',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it("should not create a customer due to invalid country", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'newmail@mail.com',
			password : 'customer',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Invalid',
			city : 'Seville',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it("should not create a customer due to missing field (city)", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'newmail@mail.com',
			password : 'customer',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			phone : '111111111'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});

	it(" should not create a customer due to missing field (phone)", function (done){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'johndoe@mail.com',
			password : 'password',
			coordinates : '12.3214;21.1230',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville'
		};

		browser
		.post("http://localhost:3000/api/signup")
		.send(customer)
		.end(function (err, res){
			res.status.should.be.equal(500);
			res.body.success.should.be.exactly(false);
			done();
		});
	});
});