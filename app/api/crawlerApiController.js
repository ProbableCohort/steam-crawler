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
  if (req.body.steamid) {
    persistProfile(req.body, res);
  } else {
    var profileSteamIds = [];
    for (var i in req.body) {
      var profile = req.body[i];
      profileSteamIds.push(profile.steamid);
      persistProfile(profile);
    }
    SteamUser
      .find({ steamid : { $in : profileSteamIds }})
      .exec(function(err, users) {
        if (err)
          console.log(err.stack);
        res.send(users);
      })
  }
})

function persistProfile(profile, res) {
    SteamUser
      .find({ steamid : profile.steamid })
      .exec(function (err, user) {
        if (err)
          console.log(err.stack);
        var foundUser;
        if (user.length && user[0].steamid == profile.steamid) {
          foundUser = user[0];
        }
        if (foundUser) {
          profile.personahistory = foundUser.personahistory || [];
          if (profile.personaname != foundUser.personaname) {
            var persona = {
              personaname : foundUser.personaname,
              lastseen : foundUser.updatedAt
            }
            profile.personahistory.push(persona);
          }
          SteamUser
            .findOneAndUpdate({ _id : foundUser._id }, profile)
            .exec(function (err, event) {
              if (res) {
                if (err)
                  res.send(err);
                res.send(event);
              }
          })
        } else {
          SteamUser.create(profile, function(err, e) {
            if (res) {
              if (err)
                console.log(err.stack);
              res.send(e);
            }
          })
        }
      })
}

module.exports = api;
