var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Get Info from recommender server API", function (){
	var browser = request.agent();

	it('should load recommender server info', function (done){
		browser
		.get('http://localhost:3000/api/recommender/checkStatus')
		.end(function (err, res) {
			res.status.should.be.equal(200);

			should.exist(res.body.online);
			done();
		});
	});
});