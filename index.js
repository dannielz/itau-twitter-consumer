var Twitter = require('twitter');//TODO remove this 3rd party lib
require('dotenv').config();

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/*
var buildQueryString = function (tags) {
    var querystring = '';
    for (let i = 0; i < tags.length; i++) {
        querystring += tags[i];
        if (i < tags.length - 1)
            querystring += " OR ";
    }
    return querystring;
}*/

var validateHashtag = function(hashtag){
    //TODO implement
    return true;
}

exports.getPostsByHashtag = function (hashtag, callback) {
    if (validateHashtag(hashtag)) {
        client.get('search/tweets', { q: hashtag,count: 100 }, function (error, tweets, response) {
            callback(error, tweets, response);
        });
    }
}
