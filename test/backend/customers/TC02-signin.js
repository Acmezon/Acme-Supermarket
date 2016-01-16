var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Post email and password to the API", function (){
	it("Authenticate into the system ", function(){
		var identification = {
			email : 'johndoe@mail.com',
			password : 'password'
		};

		request("http://localhost:3000")
			.post("/api/signin")
			.send(identification)
			.end(function(err, res){
				if(err){
					console.log("Error Signing-in (TC06-singin) -> message: "+err);
					throw err;
				}else{
					res.status.should.be.equal(200);
				}
				
			});
	});


	it("Authenticate into the system with a wrong password", function(){
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