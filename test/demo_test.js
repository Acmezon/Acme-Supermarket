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
	allScriptsTimeout: 60000,
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: [
		//'backend/demo/**/*.js'
		'e2e/demo/**/*.js'
	]
};