var express = require('express'),
  api = express.Router(),
  request = require('request'),
  KEYS = require('../../../private/keys'),
  CrawlerApiService = require('./crawlerApiService'),
  CrawlerUserController = require('./crawlerUserController'),
  CrawlerPlayerController = require('./crawlerPlayerController'),
  CrawlerGameController = require('./crawlerGameController');

var SteamUser = require('../../models/steamUser');

api.use(function(req, res, next) {
  next();
});

api.get('/personas', function(req, res) {
  CrawlerApiService.findProfilesWithPersonaHistory(req.query.count, res);
})

api.use('/user', CrawlerUserController);
api.use('/player', CrawlerPlayerController);
api.use('/game', CrawlerGameController);

module.exports = api;
