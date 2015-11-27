var mongoose = require('mongoose');

var actorSchema = mongoose.Schema({
	name: {type: String, required: true},
	surname: {type: String, required: true},
	email: {type: String,
		validate: {
			validator: function (email) {
				var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
				re.test(email);
			},
			message : '{VALUE} is not a valid email.'
		}
	},
	password: String
});

exports.schema = actorSchema;

exports.model = mongoose.model('Actor', actorSchema);