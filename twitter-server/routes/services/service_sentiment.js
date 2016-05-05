var exec = require('child_process').exec, child;
var fs = require('fs');

//Calcula las proporciones de tweets de la última hora
exports.runSentimentAnalysis = function (user_id, callback){
	exec('/home/adminuser/anaconda3/envs/asr-aia/bin/python executables/main.py', callback);
}
