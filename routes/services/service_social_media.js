var exec = require('child_process').exec, child;
var fs = require('fs');

//Inicia el proceso de escucha en twitter y guarda su ID
exports.runProcess = function (){
	child = exec('/opt/spark/bin/spark-submit --class TwitterScrapper jars/socialMediaAnalysis.jar & echo $! > tmp/pid.txt',
	function (error, stdout, stderr){
		if(error !== null){
		  console.log('exec error: ' + error);
		  return false;
		}
	});

	return fs.existsSync('tmp/pid.txt');
}

//Para el proceso de escucha en twitter cogiendo la ID previamente guardada
exports.stopProcess = function() {
	var pid = getPID();

	try {
		console.log(pid);
		var killed = process.kill(pid, 'SIGTERM');
		console.log(killed);
		return killed;
	} catch (e) {
		console.log(e);
		return false;
	}
}

//Devuelve si el servicio de escucha en twitter está activo
exports.isProcessAlive = function () {
	var pid = "";

	try {
		var pid = getPID();
	} catch (e) {
		return false;
	}

	var alive = false;

	try {
		alive = process.kill(pid, 0);
	} catch (e) {
		alive = e.code === 'EPERM'
	}

	if(!alive) {
		removePID();
	}

	return alive;
}

//Coge la ID del proceso de escucha en twitter del archivo
function getPID() {
	var pid = parseInt(fs.readFileSync('tmp/pid.txt').toString());

	return pid;
}

//Elimina el archivo con el PID del proceso para evitar solapamientos de PID antiguos
function removePID(pid) {
	try {
		fs.unlinkSync("tmp/pid.txt");
	} catch(e) { }

	return true;
}