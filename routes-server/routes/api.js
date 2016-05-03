var db_utils = require('./db_utils'),
	schedule = require('node-schedule');
var exec = require('child_process').exec, child;

exports.calculateRoute = function(req, res) {
	console.log("Api-CalculateRoute.");
	exec_py(function (error, stdout, stderr) {
			if(error) {
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
	});
}

var exec_py = function(callback){
	exec('python3 ./routes-python/main.py', callback);
}

exports.checkStatus = function(req, res) {
	res.sendStatus(200);
}

exports.notFound = function(req, res) {
	console.log("Route not found: " + req.originalUrl);
	res.sendStatus(404);
}