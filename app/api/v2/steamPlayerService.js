var request = require('request'),
  KEYS = require('../../../private/keys');

var service = {
  GetOwnedGames: GetOwnedGames,
  GetSteamLevel: GetSteamLevel
}

//////////////////////////////

var BASE_URI = 'http://api.steampowered.com/' + 'IPlayerService/';

function GetOwnedGames(req, res, cb) {
  // Calculate the Steam API URL we want to use
  var VERSION = 'v0001/'
  var url = BASE_URI + 'GetOwnedGames/' + VERSION;
  var query = {
    key: KEYS.STEAM_API_KEY,
    steamid: req.params.id
  }
  var options = {
    url: url,
    qs: query
  }
  request.get(options, function(error, steamHttpResponse, steamHttpBody) {
    if (error)
      res.send(error);
    if (cb && typeof cb === 'function') {
      cb(JSON.parse(steamHttpBody).response);
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
}

function GetSteamLevel(id, res, cb) {
  // Calculate the Steam API URL we want to use
  var VERSION = 'v1/'
  var url = BASE_URI + 'GetSteamLevel/' + VERSION;
  var query = {
    key: KEYS.STEAM_API_KEY,
    steamid: id
  }
  var options = {
    url: url,
    qs: query
  }
  request.get(options, function(error, steamHttpResponse, steamHttpBody) {
    if (error)
      res.send(error);
    if (cb && typeof cb === 'function') {
      cb(JSON.parse(steamHttpBody).response.player_level);
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
}

module.exports = service;
