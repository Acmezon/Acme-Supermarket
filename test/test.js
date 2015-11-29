var request = require('supertest');

exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: [
		//'e2e/TC01-getProducts.js',
		//'backend/authentification/TC02-signup.js',
		//'backend/authentification/TC03-signup-existingEmail.js',
		//'backend/authentification/TC04-signup-invalidField.js',
		//'backend/authentification/TC05-signup-missingField.js',
		//'backend/authentification/TC06-signin.js'
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