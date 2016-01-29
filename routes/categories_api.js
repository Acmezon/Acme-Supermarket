var Category = require('../models/category');

exports.getCategories = function (req, res) {
	console.log('Function-categoriesApi-getCategories');

	Category.find(function (err, categories) {
		if (err) {
			res.status(500).json({success: false, message: err});
		} else {
			res.status(200).json(categories);
		}
	});
}