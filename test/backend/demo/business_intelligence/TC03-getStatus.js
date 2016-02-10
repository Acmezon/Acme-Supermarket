var request = require('superagent');
var should = require('should');
var assert = require('assert');

describe("Get Info from business intelligence server API", function (){
	var browser = request.agent();

	it('should load business intelligence server info', function (done){
		browser
		.get('http://localhost:3000/api/bi/checkStatus')
		.end(function (err, res) {
			res.status.should.be.equal(200);

			should.exist(res.body.online);
			done();
		});
	});
});