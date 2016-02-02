var request = require('supertest');

exports.config = {
	capabilities: {
		browserName: "chrome",
		chromeOptions: {
			prefs: {
				"profile.default_content_setting_values.geolocation": 1,
			}
		}
	},
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: [
		//'e2e/purchasing_rules/TC03-*.js'
		'backend/purchasing_rules/TC01-*.js'

	]/*,
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
	}*/
};