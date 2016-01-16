

exports.getLanguageFile = function (req, res) {
	if(!req.query.lang) {
		res.sendStatus(500);
		return;
	}

	try {
		var lang = require('../i18n/' + req.query.lang);
		res.send(lang); // `lang ` contains parsed JSON
	} catch(err) {
		res.sendStatus(404);
	}
}