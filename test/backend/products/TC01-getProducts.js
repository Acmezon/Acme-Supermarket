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
});