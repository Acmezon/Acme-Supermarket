var request = require('superagent'),
	should = require('should'),
	assert = require('assert');

describe("Roles API", function (){
	var browser = request.agent();

	it("should return the correct role", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			res.status.should.be.equal(200);
			res.body.success.should.be.exactly(true);

			browser
			.get('http://localhost:3000/api/getUserRole')
			.end(function (err, res) {
				should.not.exist(err);

				res.status.should.be.equal(200);
				res.text.should.be.equal('admin');

				done();
			});
		});
	});

	it("should return true when logged", function (done){
		browser
		.post('http://localhost:3000/api/signin')
		.send( { email : 'admin@mail.com', password : 'administrator' } )
		.end(function (err, res) {
			res.status.should.be.equal(200);
			res.body.success.should.be.exactly(true);

			browser
			.get('http://localhost:3000/islogged')
			.end(function (err, res) {
				should.not.exist(err);

				res.status.should.be.equal(200);
				res.body.success.should.be.true;

				done();
			});
		});
	});
});