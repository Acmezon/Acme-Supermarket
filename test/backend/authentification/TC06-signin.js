var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Post email and password to the API", function (){
	it("authenticate into the system ", function(){
		var identification = {
			email : 'reder.pablo@gmail.com',
			password : 'esmuysegura'
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
});