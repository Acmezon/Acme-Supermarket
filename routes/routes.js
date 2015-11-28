
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.sendFile('index.html', {root: './public/views/public'});
};

exports.views = function (req, res) {
	var name = req.params.name;
	console.log(name);
	res.sendFile(name, {root: './public/views/public'});
};