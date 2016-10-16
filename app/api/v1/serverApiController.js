var express = require('express'),
    api     = express.Router(),
    pjson   = require('../../../package.json');



api.use(function(req, res, next) {
  next();
});

api.get('/version', function(req, res) {
  var version = { version : pjson.version };
  res.send(version);
})

module.exports = api;
