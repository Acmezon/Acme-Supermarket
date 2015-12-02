var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Post email and password to the API", function (){
	it("authenticate into the system ", function(){
		var identification = {
			email : 'johndoe@mail.com',
			password : 'randompassword'
		};

		request("http://localhost:3000")
			.post("/api/signin")
			.send(identification)
			.end(function(err, res){
				res.status.should.be.equal(200);
			});
	});
});