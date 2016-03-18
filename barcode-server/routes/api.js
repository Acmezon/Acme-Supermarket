var db_utils = require('./db_utils');
var exec = require('child_process').exec, child;

exports.scanBarcode = function(req, res) {
	console.log("Api-ScanBarcode");
	var folder = 'images/'
	var barcode_path = folder + req.body.barcode_path
	
	exec_py(barcode_path, 
		function (error, stdout, stderr) {
			if(error) {
				res.sendStatus(500);
			} else {
				number = stdout.replace(/\r?\n|\r/g, "");
				console.log(number)
				res.status(200).send(number);
			}
	});
}

var exec_py = function(barcode_path, callback){
	exec('python3 -W ignore ./opencv-barcode/main.py -p ' + barcode_path, callback);
}

exports.checkStatus = function(req, res) {
	res.sendStatus(200);
}

exports.notFound = function(req, res) {
	console.log("Route not found: " + req.originalUrl);
	res.sendStatus(404);
}