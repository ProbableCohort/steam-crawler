var express = require('express'),
    api     = express.Router(),
    request = require('request'),
    KEYS    = require('../../private/keys');

var BASE_URI = 'http://api.steampowered.com/' + 'ISteamUserStats/';

api.get('/game/:id', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v2/'
    var url = BASE_URI + 'GetSchemaForGame/' + VERSION;
    var query = { key: KEYS.STEAM_API_KEY, appid: req.params.id }
    var options = { url:url, qs:query }
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

module.exports = api;
