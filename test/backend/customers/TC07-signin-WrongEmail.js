var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Post email and password to the API", function (){
	it("Authenticate into the system with a wrong email", function(){
		var identification = {
			email : 'a@a.a',
			password : 'password'
		};

		request("http://localhost:3000")
			.post("/api/signin")
			.send(identification)
			.end(function(err, res){
				res.status.should.be.equal(200);	
			});
	});
});