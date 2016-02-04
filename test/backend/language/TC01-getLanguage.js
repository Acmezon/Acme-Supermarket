var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Get languages from the API", function (){

	it("should get languages from the languages API", function (done){
		var browser = request.agent();

		browser
		.get("http://localhost:3000/api/lang?lang=es")
		.end(function (err, res){
			res.status.should.be.equal(200);
			should.exist(res.body.LanguageNames);

			done();
		});
	});
});