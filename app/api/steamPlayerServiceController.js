var express = require('express'),
    api     = express.Router(),
    request = require('request'),
    KEYS    = require('../../private/keys');

var BASE_URI = 'http://api.steampowered.com/' + 'IPlayerService/';

api.get('/:id', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v0001/'
    var url = BASE_URI + 'GetOwnedGames/' + VERSION;
    var query = { key: KEYS.STEAM_API_KEY, steamid: req.params.id }
    var options = { url:url, qs:query }
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

module.exports = api;
