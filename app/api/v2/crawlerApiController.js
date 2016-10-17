var express = require('express'),
  api = express.Router(),
  request = require('request'),
  KEYS = require('../../../private/keys'),
  CrawlerApiService = require('./crawlerApiService');

var SteamUser = require('../../models/steamUser');

api.use(function(req, res, next) {
  next();
});

api.get('/user/all/', function(req, res) {
  CrawlerApiService.findAllProfiles(req, res);
})

api.get('/user/all/count', function(req, res) {
  CrawlerApiService.countAllProfiles(res);
})

api.get('/user/last/', function(req, res) {
  CrawlerApiService.findLastProfilesByCount(req.query.count, res);
})

api.get('/user/:id', function(req, res) {
  CrawlerApiService.findProfileBySteamId(req.params.id, res);
})

api.get('/user/:id/all', function(req, res) {
  CrawlerApiService.findAllRecordsForProfileBySteamId(req.params.id, res);
})

api.get('/user/', function(req, res) {
  if (req.query.ids) {
    var ids = req.query.ids.split(',');
    var limit = 50;
    ids = ids.slice(limit, ids.length);
    CrawlerApiService.findProfilesBySteamIds(ids, res);
  } else if (req.query.personaname) {
    CrawlerApiService.findProfileByPersonaName(req.query.personaname, res);
  }
})

api.get('/personas', function(req, res) {
  CrawlerApiService.findProfilesWithPersonaHistory(req.query.count, res);
})

api.post('/user/', function(req, res) {
  if (req.body.steamid) {
    CrawlerApiService.persistProfile(req.body, res);
  } else {
    CrawlerApiService.persistProfiles(req.body, res);
  }
})

module.exports = api;
