var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Edit product API url", function (){
	it("should edit a product", function(){

		request("http://localhost:3000")
			.get("/api/products/limit/" + 1)
			.end(function(err, res){
				res.status.should.be.equal(200);

				var product = res.body[0];
				product.name = "This is the new name";

				request("http://localhost:3000")
				.post("/api/product/updateProduct")
				.send(product)
				.end(function(err, res){
					res.status.should.be.equal(200);
				});

				request("http://localhost:3000")
				.get("/api/product/" + product._id)
				.end(function(err, res){
					res.status.should.be.equal(200);
					res.body.name.should.be.equal(name);
				});

			});
	});
});