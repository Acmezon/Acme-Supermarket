var exec = require('child_process').exec, child;
var fs = require('fs');

exports.runProcess = function (){
	child = exec('/usr/bin/java -jar ../social_media_jar/twitter-scrapper',
	function (error, stdout, stderr){
		console.log("Creado");
		if(error !== null){
		  console.log('exec error: ' + error);
		}
	});

	fs.writeFile("../tmp/pid.json", JSON.stringify({ "pid" : child.pid }), 
	function (err) {
		if(err) {
			console.log(err);
			return false;	
		}

		return true;
	});
}

exports.stopProcess = function() {
	var pid = getPID();

	try {
		return process.kill(pid);
	} catch (e) {
		return false;
	}
}

exports.isProcessAlive = function () {
	var pid = getPID();

	try {
		return process.kill(pid, 0)
	} catch (e) {
		return e.code === 'EPERM'
	}
}

function getPID() {
	var json = JSON.parse(fs.readFileSync('../tmp/pid.json"').toString());

	var pid = json['pid'];

	return pid;
}