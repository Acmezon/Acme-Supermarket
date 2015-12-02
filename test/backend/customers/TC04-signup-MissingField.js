var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Post a customer to the API", function (){
	it("Try to create a customer with an missing field (phone), should respond 500", function(){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'johndoe@mail.com',
			password : 'password',
			credit_card: '5430599805623360',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville'
		};

		request("http://localhost:3000")
			.post("/api/signup")
			.send(customer)
			.end(function(err, res){
				if(err){
					console.log("Error Signing-up a customer -> message: "+err);
					throw err;
				}else{
					res.status.should.be.equal(500);
				}
				
			});
	});
});