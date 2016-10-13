var express = require('express'),
    api     = express.Router(),
    request = require('request');

var crawlerApiController = require('./crawlerApiController');

api.use(function(req, res, next) {
	next();
});

api.use('/crawler', crawlerApiController);

module.exports = api;
