var VERSION = require('./package.json').version;
var request = require('request');
/**
 * Wrapper to make twitter api rest request
 * @param {Object} keys consumer keys generated from twitter app
 */
var TwitterConsumer = function(keys) {

    this.details = {
            consumer_key: keys.consumer_key,
            consumer_secret: keys.consumer_secret,
            access_token_key: keys.access_token_key,
            access_token_secret: keys.access_token_secret,
            bearer_token: this.consumer_key + ":" + this.consumer_secret,
            bearer_token_64: Buffer.from(this.consumer_key + ":" + this.consumer_secret).toString('base64'),
            app_authentication: "https://api.twitter.com/oauth2/token",
            request_token_url: "https://api.twitter.com/oauth/request_token",
            authorize_url: "https://api.twitter.com/oauth/authorize",
            access_token_url: "https://api.twitter.com/oauth/access_token"
        }
        /**
         * Make get request to twitter rest api
         * @param {String} path path of endpoint to use in twitter REST api URL base = : https://api.twitter.com/1.1
         * @param {Object} parameters parameters to query from api, see twitter api reference for more info
         * @param {Function} callback callback function executed after request on twitter api 
         */
    this.get = function(path, parameters, callback) {
        var base = 'https://api.twitter.com/1.1'
        var endpoint = base;
        endpoint += (path.charAt(0) === '/') ? path : '/' + path;
        endpoint = endpoint.replace(/\/$/, '');

        endpoint += (path.split('.').pop() !== 'json') ? '.json' : '';
        token_request = request({
            uri: endpoint,
            method: "get",
            timeout: 5000,
            headers: {
                Accept: '*/*',
                Connection: 'close',
                'User-Agent': 'itau-twitter-consumer/' + VERSION,
                Authorization: 'Bearer ' + this.details.bearer_token
            },

            qs: parameters,
            oauth: {
                consumer_key: this.details.consumer_key,
                consumer_secret: this.details.consumer_secret,
                //token: this.details.access_token_key,
                //token_secret: this.details.access_token_secret

            }

        }, function(error, response, data) {

            try {
                if (data === '') {
                    data = {};
                } else {
                    data = JSON.parse(data, function(k, v) {
                        return (typeof v === 'string') ? unescape(v) : v;
                    });
                }
            } catch (parseError) {
                return callback(
                    error,
                    data,
                    response
                );
            }
            if (response.statusCode < 200 || response.statusCode > 299) {
                return callback(
                    error,
                    data,
                    response
                );
            }
            callback(error, response, data);
        });
    }
}
module.exports = TwitterConsumer;

/*
console.log(process.env.TWITTER_CONSUMER_KEY);
console.log(process.env.TWITTER_CONSUMER_SECRET);
console.log(process.env.TWITTER_ACCESS_TOKEN_KEY);
console.log(process.env.TWITTER_ACCESS_TOKEN_SECRET);

var testConsumer = new TwitterConsumer({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    //  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    // access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

testConsumer.get('search/tweets', { q: "#twitter", count: 100 }, function(error, response, data) {
    console.log(data);
})*/