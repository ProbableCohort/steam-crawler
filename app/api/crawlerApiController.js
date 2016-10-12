var express = require('express'),
    api     = express.Router(),
    request = require('request'),
    KEYS    = require('../../private/keys');

var SteamUser = require('../models/steamUser');

api.use(function(req, res, next) {
  next();
});

api.get('/user/:id', function(req, res) {
  SteamUser
    .find({ steamid : req.params.id })
    .exec(function (err, user) {
      if (err)
        console.log(err.stack);
      res.send(user);
    })
})

api.post('/user', function(req, res) {
  SteamUser
    .find({ steamid : req.body.steamid })
    .exec(function (err, user) {
      if (err)
        console.log(err.stack);
      var foundUser;
      if (user.length && user[0].steamid == req.body.steamid) {
        foundUser = user[0];
      }
      if (foundUser) {
        req.body.personahistory = foundUser.personahistory || [];
        if (req.body.personaname != foundUser.personaname) {
          var persona = {
            personaname : foundUser.personaname,
            lastseen : foundUser.updatedAt
          }
          req.body.personahistory.push(persona);
        }
        SteamUser
          .findOneAndUpdate({ _id : foundUser._id }, req.body)
          .exec(function (err, event) {
            if (err)
              res.send(err);
            res.send(event);
        })
      } else {
        SteamUser.create(req.body, function(err, e) {
          if (err)
            console.log(err.stack);
          res.send(e);
        })
      }
    })
})

module.exports = api;
