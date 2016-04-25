var exec = require('child_process').exec, child;
var fs = require('fs');

//Actualiza la recomendación en base a puntuaciones
exports.runRatesRecommendation = function (user_id, callback){
	exec('/home/adminuser/anaconda3/envs/asr-aia/bin/python executables/run_filter.py -o run -u ' + user_id, callback);
}

//Actualiza la recomendación en base a compras
exports.runPurchasesRecommendation = function (user_id, callback){
	throw "Not supported";
	exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main jars/recommenderSystem.jar purchases ' + user_id, callback);
}

//Actualiza los parámetros de recomendación
exports.updateParameters = function (user_id, callback) {
	exec('/home/adminuser/anaconda3/envs/asr-aia/bin/python executables/run_filter.py -o pre -u 1', callback);
}

//Actualiza las reglas de asociación para la vista del carrito
exports.updateAIARules = function (callback) {
	exec("python3 ../PROYECTO/rules/run_rules.py -db Acme-Supermarket -t enhanced -s 0.015 -c 0.5",
		callback
	);
}