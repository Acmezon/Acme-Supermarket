
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.sendFile('index.html', {root: './views'});
};

exports.partials = function (req, res) {
	var name = req.params.name;
	console.log(name);
	res.sendFile('partials/' + name, {root: './views'});
};