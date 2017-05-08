from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import json
import time
import MySQLdb
# Loads tweets into the database using the twitter streaming API


#consumer key, consumer secret, access token, access secret.
# ckey="L2EU48RhIuzaGwQajWp93eyLe"
# csecret="0LboLyh118K7LSIjmjcX6dvk8SYrFRUfojKuBy9j63mLH2zDQP"
# atoken="857389115695693825-JscSkF773HYchgf0TUrpvcCh4tFqGR1"
# asecret="5BoF9B4tPPReQoMPSUZ6DCjibB5tYhpQYKX96I3OCMDvR"
# host="104.131.152.50"
# user="datavis"
# passwd="verysupersecurepassword314"
# db="datavis"

# see README for how to setup config
with open("../config.json") as f:
    config = json.load(f)
tweepy_config = config["tweepy"]

conn = MySQLdb.connect(config["host"], config["user"], config["password"], config["database"], charset='utf8mb4')
cur = conn.cursor()


class listener(StreamListener):

    def on_data(self, data):
        try:
            data = json.loads(data)
            if not data.get('place'):
                return # place isn't set
            id = data['id_str']
            date = time.time()
            tweet = data['text']
            hashtags = data['entities']['hashtags']
            longitude = float(data['place']['bounding_box']['coordinates'][0][0][0])
            latitude = float(data['place']['bounding_box']['coordinates'][0][0][1])
            cur.execute("INSERT INTO tweets VALUES (%s, %s, %s, %s, %s)", (id, date, tweet, longitude, latitude))
            conn.commit()
        except MySQLdb.Error as err:
            print(f"Something went wrong: {err}")
        except:
            print(json.dumps(data, indent='\t'))
            raise

    def on_error(self, status):
        print(status)

auth = OAuthHandler(tweepy_config["ckey"], tweepy_config["csecret"])
auth.set_access_token(tweepy_config["atoken"], tweepy_config["asecret"])

twitterStream = Stream(auth, listener())
twitterStream.filter(locations=[-180,-90,180,90])