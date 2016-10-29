var express = require('express'),
  api = express.Router(),
  KEYS = require('../../../private/keys'),
  CrawlerApiService = require('./crawlerApiService'),
  SteamUserService = require('./steamUserService'),
  SteamPlayerService = require('./steamPlayerService');

var SteamUser = require('../../models/steamUser');

api.get('/all/', function(req, res) {
  CrawlerApiService.findAllProfiles(req, res);
})

api.get('/all/count', function(req, res) {
  CrawlerApiService.countAllProfiles(res);
})

api.get('/last/', function(req, res) {
  CrawlerApiService.findLastProfilesByCount(req.query.count, res);
})

api.get('/:id', function(req, res) {
  CrawlerApiService.findProfileBySteamId(req.params.id, res);
})

api.get('/:id/all', function(req, res) {
  CrawlerApiService.findAllRecordsForProfileBySteamId(req.params.id, res);
})

api.get('/', function(req, res) {
  if (req.query.ids) {
    var ids = req.query.ids.split(',');
    var limit = 300;
    ids = ids.slice(0, limit);
    CrawlerApiService.findProfilesBySteamIds(ids, res);
  } else if (req.query.personaname) {
    CrawlerApiService.findProfileByPersonaName(req.query.personaname, res);
  }
})

api.post('/', function(req, res) {
  if (req.body.steamid) {
    CrawlerApiService.persistProfile(req.body, res);
  } else {
    CrawlerApiService.persistProfiles(req.body, res);
  }
})

module.exports = api;
