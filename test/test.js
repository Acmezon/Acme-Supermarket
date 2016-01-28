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
		'e2e/authentication/TC03-signout.js'
		//'backend/products/TC03-rateProduct.js'

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