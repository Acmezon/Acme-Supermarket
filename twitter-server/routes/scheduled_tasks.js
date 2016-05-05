var schedule = require('node-schedule'),
	sync = require('synchronize')
	SentimentService = require('./services/service_sentiment'),
	log = require('../logger');

exports.scheduleSentimentAnalysis = function() {
	//Every hour
	var autoPurchase = schedule.scheduleJob('0 * * * *', function(){
		SentimentService.runSentimentAnalysis(function (err, data){
			if(err) {
				log.info('Error executing automatic sentiment analysis. Error %s', err);
			} else {
				log.info('Automatic sentiment analysis executed successfuly');
			}
		});
	});

	console.log("Sentiment analysis successfuly scheduled")
}