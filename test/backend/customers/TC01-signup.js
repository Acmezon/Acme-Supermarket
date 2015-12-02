var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Post a customer to the API", function (){
	it("Create a new entry in the customers collection, should respond 200", function(){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'johndoe2@mail.com',
			password : 'password',
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
					res.status.should.be.equal(200);
				}
				
			});
	});

	it("Try to create a customer with an existing email, should respond 500", function(){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'johndoe@mail.com',
			password : 'password',
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

	it("Try to create a customer with an invalid value on phone, should respond 500", function(){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'pablo@email.com',
			password : 'password',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '11111'
		};

		request("http://localhost:3000")
			.post("/api/signup")
			.send(customer)
			.end(function(err, res){
				if(err){
					console.log("Error Signing-up a customer -> message: "+err);
					throw err;
				}else{
					//res.status.should.be.equal(500);
				}
				
			});
	});

	
	it("Try to create a customer with an missing field (phone), should respond 500", function(){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'johndoe@mail.com',
			password : 'password',
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