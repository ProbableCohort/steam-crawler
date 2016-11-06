var request = require('request'),
  KEYS = require('../../../private/keys'),
  CrawlerApiService = require('./crawlerApiService'),
  SteamUserService = require('./steamUserService'),
  SteamPlayerService = require('./steamPlayerService'),
  SteamGameService = require('./steamGameService');

var SteamGame = require('../../models/steamGame');

var service = {
  countGames: countGames,
  getGame: getGame,
  getGames: getGames,
  populateGame: populateGame,
  persistGame: persistGame
}

var gameRequestsInfo = {
  requestIntervalStart: null,
  requestsInLastFiveMinutes: 0
};

var settings = {
  maxGameRequests: 200,
  requestInterval: 5 * 60 * 1000
}

function countGames(cb) {
  SteamGame
    .count({
      "name": {
        $exists: true
      }
    })
    .exec(function(err, count) {
      cb(count)
    })
}

function getGames(appids, cb) {
  var query = {
    "name": {
      $exists: true
    }
  }
  if (appids) {
    appids = appids.split(',')
    query.steam_appid = {
      $in: appids
    }
  }
  SteamGame
    .find(query)
    .exec(function(err, games) {
      if (err)
        return console.log(err);
      return cb(games);
    })
}

function getGame(appid, cb) {
  appid = parseInt(appid);
  SteamGame
    .find({
      steam_appid: appid
    })
    .exec(function(err, games) {
      if (err)
        return console.log(err);
      if (games.length)
        return cb(games[0]);
      return populateGame(appid, cb);
    })
}

function populateGame(appid, cb) {
  checkGameRequestRate(cb);
  SteamGameService.GetGameDetails(appid, function(game) {
    if (!game) {
      var game = {};
      game.steam_appid = appid;
      game.type = "invalidGame";
    }
    return persistGame(game, cb);
  })
}

function checkGameRequestRate(cb) {
  if (gameRequestsInfo.requestIntervalStart) {
    var now = new Date();
    if (now - gameRequestsInfo.requestIntervalStart < settings.requestInterval && gameRequestsInfo.requestsInLastFiveMinutes < settings.maxGameRequests) {
      gameRequestsInfo.requestsInLastFiveMinutes++;
    } else if (now - gameRequestsInfo.requestIntervalStart >= settings.requestInterval) {
      gameRequestsInfo.requestIntervalStart = new Date();
      gameRequestsInfo.requestsInLastFiveMinutes = 1;
    } else {
      return cb(null);
    }
  } else {
    gameRequestsInfo.requestIntervalStart = new Date();
    gameRequestsInfo.requestsInLastFiveMinutes = 1;
  }
}

function persistGame(game, cb) {
  SteamGame.create(game, function(err, game) {
    if (err)
      return err.stack;
    cb(game);
  })
}

module.exports = service;
