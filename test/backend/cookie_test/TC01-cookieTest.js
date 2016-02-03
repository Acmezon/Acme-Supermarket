var should = require('should'),
	assert = require('assert'),
	request = require('superagent');


describe('Test call to get cookie', function(){
	var browser = request.agent();

	it('should send product details', function (done){
		browser
		.get('http://localhost:3000/api/cookietest')
		.set('Cookie', ['test=12345667'])
		.end(function (err, res) {
			res.status.should.be.equal(200);

			done();
		});
	});
});