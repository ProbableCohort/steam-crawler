var express = require('express'),
    api     = express.Router(),
    request = require('request'),
    KEYS    = require('../../../private/keys');

var BASE_URI = 'http://api.steampowered.com/' + 'ISteamUserStats/';

/**
*  Get the details for a game
*  @return { gameName: String, gameVersion: String, availableGameStats : { acheivements : [] } }
*/
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

/**
*  No clue, can't find a stat name that is acceptable (?name[0])
*/
api.get('/game/:id/acheivements', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v1/'
    var url = BASE_URI + 'GetGlobalStatsForGame/' + VERSION;
    var query = { key: KEYS.STEAM_API_KEY, appid: req.params.id, count: req.query.count, name: req.query.name }
    var options = { url:url, qs:query }
    console.log(options);
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

/**
*  Gets a player's achievements for a game
*  @return { name: String, acheived: Number }
*/
api.get('/game/:id/player/:pid', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v2/'
    var url = BASE_URI + 'GetUserStatsForGame/' + VERSION;
    var query = { key: KEYS.STEAM_API_KEY, appid: req.params.id, steamid: req.params.pid }
    var options = { url:url, qs:query }
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

/**
*  Gets the number of concurrent players for a game
*  @return { player_count: Number, result: Number }
*/
api.get('/game/:id/players', function(req, res) {
    // Calculate the Steam API URL we want to use
    var VERSION = 'v1/'
    var url = BASE_URI + 'GetNumberOfCurrentPlayers/' + VERSION;
    var query = { key: KEYS.STEAM_API_KEY, appid: req.params.id }
    var options = { url:url, qs:query }
    request.get(options, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

module.exports = api;
