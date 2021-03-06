var express = require('express'),
    api     = express.Router(),
    request = require('request');

var v1  = require('./v1/main'),
    v2  = require('./v2/main');

api.use(function(req, res, next) {
	next();
});

api.use('/v1', v1);
api.use('/v2', v2);

module.exports = api;
