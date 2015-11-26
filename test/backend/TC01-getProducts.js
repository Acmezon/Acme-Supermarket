var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Get products from the API", function (){
	it("get products from the Products api", function(){

		request("http://10.10.0.142:3000")
			.get("/api/products")
			.end(function(err, res){
				res.body.length.should.be.equal(2);
				res.status.should.be.equal(200);
			});
	});
});