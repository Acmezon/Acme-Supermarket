var exec = require('child_process').exec, child;
var fs = require('fs');

//Inicia el proceso de escucha en twitter y guarda su ID
exports.runRecommendation = function (user_id){
	child = exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main recommender-server/jars/recommendationSystem.jar ' + user_id,
	function (error, stdout, stderr){
		var success = true;
		if(error !== null){
		  console.log('exec error: ' + error);
		  success = false;
		}

		return success;
	});

}