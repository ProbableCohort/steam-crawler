var express = require('express'),
    api     = express.Router(),
    request = require('request'),
    KEYS    = require('../../../private/keys'),
    CrawlerApiService = require('./crawlerApiService');

var SteamUser = require('../../models/steamUser');

api.use(function(req, res, next) {
  next();
});

api.get('/user/:id', function(req, res) {
  CrawlerApiService.findProfileBySteamId(req.params.id, res);
})

api.get('/personas', function(req, res) {
  CrawlerApiService.findProfilesWithPersonaHistory(res);
})

api.post('/user', function(req, res) {
  if (req.body.steamid) {
    CrawlerApiService.persistProfile(req.body, res);
  } else {
    CrawlerApiService.persistProfiles(req.body, res);
  }
})

module.exports = api;
