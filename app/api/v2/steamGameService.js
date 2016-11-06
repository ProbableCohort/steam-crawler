var request = require('request'),
  KEYS = require('../../../private/keys');

var service = {
  GetGameDetails: GetGameDetails
}

var BASE_URI = 'http://api.steampowered.com/' + 'ISteamUser/';

function GetGameDetails(appid, cb) {
  var url = 'http://store.steampowered.com/api';
  var action = '/appdetails';
  url = url + action;
  var query = {
    appids: appid
  }
  var options = {
    url: url,
    qs: query
  }
  request.get(options, function(error, steamHttpResponse, steamHttpBody) {
    if (error)
      return console.log(error);
    return cb(JSON.parse(steamHttpBody)[appid.toString()].data)
  });
}

module.exports = service;
