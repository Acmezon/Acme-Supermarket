var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Post a customer to the API", function (){
	it("try to create a customer with an existing email, should respond 500", function(){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'johndoe@gmail.com',
			password : 'password',
			credit_card: '5430599805623360',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
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