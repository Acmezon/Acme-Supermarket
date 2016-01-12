var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Edit product API url", function (){
	it("should edit a product", function(){

		var id = "56942f7900fd90fe69ccbabc"; 
		var name = "new-sunglasses";
		var product = {
			id: id,
			field: "name",
			data: name
		};

		request("http://localhost:3000")
			.post("/api/product/updateProduct")
			.send(product)
			.end(function(err, res){
				res.status.should.be.equal(200);
			});

		request("http://localhost:3000")
			.get("/api/product/" + id)
			.end(function(err, res){
				console.log(res.body)
				res.body.name.should.be.equal(name);
			});
	});
});