var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Edit product rate API url", function (){
	it("should edit a product rate", function(){

		var id = "56942f7900fd90fe69ccbabc"; 
		var rating = 4;
		var product = {
			id: id,
			rating: rating
		};

		request("http://localhost:3000")
			.post("/api/product/updateProductRating")
			.send(product)
			.end(function(err, res){
				res.status.should.be.equal(200);
			});

		request("http://localhost:3000")
			.get("/api/product/" + id)
			.end(function(err, res){
				res.body.rating.should.be.equal(rating
					);
			});
	});
});