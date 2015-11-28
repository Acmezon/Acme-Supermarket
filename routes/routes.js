
/*
 * GET home page.
 */
exports.index = function(req, res){
	console.log("Public");
	res.sendFile('index.html', {root: './public/views/public'});
};