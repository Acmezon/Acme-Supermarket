var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Get categories from the API", function (){

	it("should get categories from the categories API", function (done){
		var browser = request.agent();

		browser
		.get("http://localhost:3000/api/categories")
		.end(function(err, res){
			res.status.should.be.equal(200);
			res.body.length.should.be.above(0);

			done();
		});
	});
});