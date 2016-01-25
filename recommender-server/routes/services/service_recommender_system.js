var exec = require('child_process').exec, child;
var fs = require('fs');

//Actualiza la recomendación en base a puntuaciones
exports.runRatesRecommendation = function (user_id, callback){
	exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main jars/recommenderSystem.jar rates ' + user_id, callback);
}

//Actualiza la recomendación en base a compras
exports.runPurchasesRecommendation = function (user_id, callback){
	exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main jars/recommenderSystem.jar purchases ' + user_id, callback);
}

//Actualiza los parámetros de recomendación
exports.updateParameters = function (user_id, callback) {
	exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main jars/recommenderSystem.jar update_rates ' + user_id, callback);

	exec('/opt/spark/bin/spark-submit --driver-memory 2g --class Main jars/recommenderSystem.jar update_purchases ' + user_id, callback);
}