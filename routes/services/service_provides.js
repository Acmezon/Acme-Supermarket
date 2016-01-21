var Provide = require('../../models/provide');

// Returns a provide object by id
exports.getProvideById = function(provide_id, callback) {
	Provide.findById(provide_id, function (error, provide) {
		if (error) {
			callback(null)
		} else {
			callback(provide);
		}
	});
}