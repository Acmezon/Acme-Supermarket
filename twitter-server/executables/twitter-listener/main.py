# -*- coding: utf-8 -*-
from datetime import datetime
from credentials import consumer_key, consumer_secret, access_token, access_token_secret
import tweepy
import os
import time
from StreamListener import TwitterListener

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)
logs_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)),
            'logs');
while True:
    try:
        with open('{0}/streamer.log'.format(logs_dir), 'w') as log:
            print("{0}: Waking up!".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")), file=log)

        myStreamListener = TwitterListener(api)
        myStream = tweepy.Stream(auth = api.auth, listener=myStreamListener)
        
        myStream.filter(languages=['en'], track=['#pollingday'])
    except TimeoutError:
        with open('{0}/streamer.log'.format(logs_dir), 'w') as log:
            print("{0}: Going to sleep...".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")), file=log)

        time.sleep(15 * 60)
