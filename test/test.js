var request = require('supertest');

exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: [
		'e2e/**',
		'backend/**'
	],
	beforeLaunch: function() {
		request("http://localhost:3000")
			.get("/api/resetDataset")
			.end(function(err){
				if(err){
					console.log("Error Reseting the database - err: "+err);
					throw err;
				}else{
					console.log("Reset Database done, check the console");
				}
			});
	}
};