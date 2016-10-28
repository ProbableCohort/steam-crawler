var express = require('express'),
  api = express.Router(),
  request = require('request'),
  KEYS = require('../../../private/keys');

var BASE_URI = 'http://api.steampowered.com/' + 'ISteamUser/';

api.get('/:id', function(req, res) {
  var steamids = req.params.id;
  var idsArr = req.params.id.split(',');
  if (idsArr.length > 1) {
    var limit = 300;
    idsArr = idsArr.slice(0, limit);
    steamids = idsArr.join(',');
  }
  // Calculate the Steam API URL we want to use
  var VERSION = 'v0002/'
  var url = BASE_URI + 'GetPlayerSummaries/' + VERSION;
  var query = {
    key: KEYS.STEAM_API_KEY,
    steamids: steamids
  }
  var options = {
    url: url,
    qs: query
  }
  request.get(options, function(error, steamHttpResponse, steamHttpBody) {
    if (error) {
      res.send(error);
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
});

api.get('/', function(req, res) {
  // Calculate the Steam API URL we want to use
  var VERSION = 'v0002/'
  var url = BASE_URI + 'GetPlayerSummaries/' + VERSION;
  var query = {
    key: KEYS.STEAM_API_KEY,
    steamids: req.query.ids
  }
  var options = {
    url: url,
    qs: query
  }
  request.get(options, function(error, steamHttpResponse, steamHttpBody) {
    if (error)
      res.send(error);
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
});

api.post('/', function(req, res) {
  // Calculate the Steam API URL we want to use
  var VERSION = 'v0002/'
  var url = BASE_URI + 'GetPlayerSummaries/' + VERSION;
  var query = {
    key: KEYS.STEAM_API_KEY,
    steamids: req.body.ids
  }
  var options = {
    url: url,
    qs: query
  }
  request.get(options, function(error, steamHttpResponse, steamHttpBody) {
    if (error)
      res.send(error);
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
});

api.get('/:id/friends', function(req, res) {
  // Calculate the Steam API URL we want to use
  var VERSION = 'v0001/'
  var url = BASE_URI + 'GetFriendList/' + VERSION;
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
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
});

api.get('/:id/personahistory', function(req, res) {
  var url = 'http://steamcommunity.com/profiles/';
  var action = '/ajaxaliases/';
  url = url + req.params.id + action;
  request.get(url, function(error, steamHttpResponse, steamHttpBody) {
    if (error)
      res.send(error);
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
})

module.exports = api;
