var request = require('superagent'),
	should = require('should'),
	assert = require('assert');

describe("Post email and password to the API", function (){
	var browser = request.agent();

	it("should authenticate into the system ", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			res.status.should.be.equal(200);
			res.body.success.should.be.exactly(true);
			done();
		});
	});


	it("should not authenticate into the system due to wrong password", function (done){
		var identification = {
			email : 'alex.gallardo@example.com',
			password : 'randompassword'
		};

		browser
		.post("http://localhost:3000/api/signin")
		.send(identification)
		.end(function (err, res){
			res.status.should.be.equal(200);
			res.body.success.should.be.exactly(false);
			done();
		});
	});


	it("should not authenticate into the system due to wrong email", function (done){
		var identification = {
			email : 'a@a.a',
			password : 'customer'
		};

		browser
		.post("http://localhost:3000/api/signin")
		.send(identification)
		.end(function(err, res){
			res.status.should.be.equal(200);
			res.body.success.should.be.exactly(false);
			done();
		});
	});
});