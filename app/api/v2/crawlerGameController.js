var express = require('express'),
  api = express.Router(),
  request = require('request'),
  KEYS = require('../../../private/keys'),
  CrawlerApiService = require('./crawlerApiService'),
  CrawlerUserController = require('./crawlerUserController'),
  CrawlerPlayerController = require('./crawlerPlayerController'),
  CrawlerGameService = require('./crawlerGameService');

var SteamUser = require('../../models/steamUser');

api.use(function(req, res, next) {
  next();
});

api.get('/:appid', function(req, res) {
  CrawlerGameService.getGame(req.params.appid, function(game) {
    res.send(game);
  })
})

api.get('/', function(req, res) {
  if (req.query.count) {
    CrawlerGameService.countGames(function(count) {
      var result = {
        totalGames: count
      }
      res.send(result);
    })
  } else {
    CrawlerGameService.getGames(req.query.appids, function(games) {
      res.send(games);
    })
  }
})

module.exports = api;
