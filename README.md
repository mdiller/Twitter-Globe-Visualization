# Twitter Globe Visualization

A visualization of where tweets originated from on a globe. Makes use of a modified version of the [WebGL Globe](https://www.chromeexperiments.com/globe) project.

This project was created for a CS 458 Information Visualization class by Malcolm Diller, Jacob Matthew, and Hannah Solorzano.

# Setup / Config

If you want to set this up yourself, make sure to include a config.json file in the root folder. It should look something like this:
```json
{
	"host": "<host ip address>",
	"user": "<db username>",
	"password": "<db password>",
	"database": "<db name>",
	"tweepy": {
		"ckey": "<consumer key>",
		"csecret": "<consumer secret>",
		"atoken": "<access token>",
		"asecret": "<access secret>"
	}
}
```

Then run:
```
npm install
npm start
```
You'll also need some sort of php stack running, so that the simple backend can work.
