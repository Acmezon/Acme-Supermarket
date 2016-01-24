var exec = require('child_process').exec, child;
var fs = require('fs');

//Inicia el proceso de escucha en twitter y guarda su ID
exports.runRecommendation = function (user_id, callback){
	exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main recommender-server/jars/recommendationSystem.jar rates ' + user_id, callback);

	exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main recommender-server/jars/recommendationSystem.jar purchases ' + user_id, callback);
}

exports.updateParameters = function (user_id, callback) {
	exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main recommender-server/jars/recommendationSystem.jar update_rates ' + user_id, callback);

	exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main recommender-server/jars/recommendationSystem.jar update_purchases ' + user_id, callback);
}