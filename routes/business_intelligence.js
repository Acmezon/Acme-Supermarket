var request = require('request');

exports.getSalesOverTime = function (req, res) {
	var supplier_id = req.params.id;
	request({
		'method' : 'GET',
		'url' : 'http://localhost:3031/api/bi/getSalesOverTime/'+supplier_id
	}, function (err, response, body) {
		if(err){
			res.sendStatus(500);
		} else {
			res.status(200).send(body);
		}
	});
}