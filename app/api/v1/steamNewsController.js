var express = require('express'),
    api     = express.Router(),
    request = require('request'),
    KEYS    = require('../../../private/keys');

var BASE_URI = 'http://api.steampowered.com/' + 'ISteamNews/';

api.get('/:id', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v0002/'
    var url = BASE_URI + 'GetNewsForApp/' + VERSION;
    var query = {
      key: KEYS.STEAM_API_KEY,
      appid: req.params.id, 
      count: req.query.count,
      maxlength: req.query.maxlength }
    var options = { url:url, qs:query }
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});
module.exports = api;
