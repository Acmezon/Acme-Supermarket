var path = require('path'),
	bunyan = require('bunyan');

var relative_route = 'logs/scheduled-tasks.log';
var abs_path = path.resolve(__dirname, relative_route);

var log = bunyan.createLogger({
	name: 'AcmeSupermarket',
	streams: [
		{
			level: 'info',
			path: abs_path
		}
	]
});

module.exports = log;