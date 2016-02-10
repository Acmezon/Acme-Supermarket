var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Get products from the API", function (){
	it("should get products from the products API", function (done){
		var browser = request.agent();

		browser
		.get("http://localhost:3000/api/products/limit/" + 10)
		.end(function(err, res){
			res.status.should.be.equal(200);
			res.body.length.should.be.equal(10);
			done();
		});
	});

	it("should get filtered products from the products API", function (done){
		var browser = request.agent();

		browser
		.post("http://localhost:3000/api/products/filtered/")
		.end(function(err, res){
			res.status.should.be.equal(200);
			res.body.length.should.be.above(0);
			done();
		});
	});

	it("should get filtered products count from the products API", function (done){
		var browser = request.agent();

		browser
		.post("http://localhost:3000/api/products/filtered/count")
		.end(function(err, res){
			res.status.should.be.equal(200);

			res.body.should.be.above(0);
			done();
		});
	});

	it("should get products by a list of IDs", function (done){
		var browser = request.agent();

		browser
		.post("http://localhost:3000/api/product/getByIdList")
		.send({
			products : {
				data: [3, 4, 5]
			}
		})
		.end(function (err, res){
			res.status.should.be.equal(200);
			res.body.length.should.be.above(0);
			done();
		});
	});
});