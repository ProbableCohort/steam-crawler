var express = require('express'),
    api     = express.Router(),
    request = require('request'),
    KEYS    = require('../../../private/keys');

var steamUserStatsController      = require('./steamUserStatsController'),
    steamUserController           = require('./steamUserController'),
    steamPlayerServiceController  = require('./steamPlayerServiceController');

api.use(function(req, res, next) {
  next();
});

api.use('/stats', steamUserStatsController);
api.use('/user', steamUserController);
api.use('/player', steamPlayerServiceController);

module.exports = api;
