var express = require('express'),
    api     = express.Router(),
    request = require('request'),
    KEYS    = require('../../../private/keys');

var BASE_URI = 'http://api.steampowered.com/' + 'ISteamUser/';

api.get('/:id', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v0002/'
    var url = BASE_URI + 'GetPlayerSummaries/' + VERSION;
    var query = { key: KEYS.STEAM_API_KEY, steamids: req.params.id }
    var options = { url:url, qs:query }
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

api.get('/', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v0002/'
    var url = BASE_URI + 'GetPlayerSummaries/' + VERSION;
    var query = { key: KEYS.STEAM_API_KEY, steamids: req.query.ids }
    var options = { url:url, qs:query }
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

api.post('/', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v0002/'
    var url = BASE_URI + 'GetPlayerSummaries/' + VERSION;
    var query = { key: KEYS.STEAM_API_KEY, steamids: req.body.ids }
    var options = { url:url, qs:query }
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

api.get('/:id/friends', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v0001/'
    var url = BASE_URI + 'GetFriendList/' + VERSION;
    var query = { key: KEYS.STEAM_API_KEY, steamid: req.params.id }
    var options = { url:url, qs:query }
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

module.exports = api;
