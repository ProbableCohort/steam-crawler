var express = require('express'),
    api     = express.Router(),
    request = require('request');

var serverApiController = require('./serverApiController'),
    steamApiController  = require('./steamApiController'),
    crawlerApiController = require('./crawlerApiController');

api.use(function(req, res, next) {
	next();
});

api.use('/server', serverApiController);
api.use('/steam', steamApiController);
api.use('/crawler', crawlerApiController);

module.exports = api;
