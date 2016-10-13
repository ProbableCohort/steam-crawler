var express = require('express'),
    api     = express.Router(),
    request = require('request');

var v1  = require('./v1/main');

api.use(function(req, res, next) {
	next();
});

api.use('/v1', v1);

module.exports = api;
