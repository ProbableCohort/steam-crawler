var request = require('request'),
  KEYS = require('../../../private/keys');

var service = {
  GetPlayerSummaries: GetPlayerSummaries,
  GetFriendList: GetFriendList
}

var BASE_URI = 'http://api.steampowered.com/' + 'ISteamUser/';

function GetPlayerSummaries(ids, res, cb) {
  if (!(typeof ids === 'string'))
    ids = ids.join(',');
  // Calculate the Steam API URL we want to use
  var VERSION = 'v0002/'
  var url = BASE_URI + 'GetPlayerSummaries/' + VERSION;
  var query = {
    key: KEYS.STEAM_API_KEY,
    steamids: ids
  }
  var options = {
    url: url,
    qs: query
  }
  request.get(options, function(error, steamHttpResponse, steamHttpBody) {
    if (error)
      res.send(error);
    if (cb && typeof cb === 'function') {
      cb(JSON.parse(steamHttpBody).response.players);
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
}

function GetFriendList(id, res, cb) {
  // Calculate the Steam API URL we want to use
  var VERSION = 'v0001/'
  var url = BASE_URI + 'GetFriendList/' + VERSION;
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
      console.log(error);
    if (cb && typeof cb === 'function') {
      var json = JSON.parse(steamHttpBody);
      var friends = json.friendslist ? json.friendslist.friends : [];
      cb(friends);
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
}

function GetPersonaHistory(req, res) {
  var url = 'http://steamcommunity.com/profiles/';
  var action = '/ajaxaliases/';
  url = url + req.params.id + action;
  request.get(url, function(error, steamHttpResponse, steamHttpBody) {
    if (error)
      res.send(error);
    res.setHeader('Content-Type', 'application/json');
    res.send(steamHttpBody);
  });
}

module.exports = service;
