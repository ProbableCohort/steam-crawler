
var SteamUser = require('../models/steamUser');

var service = {
  findProfileBySteamId : findProfileBySteamId,
  findProfilesWithPersonaHistory : findProfilesWithPersonaHistory,
  persistProfile : persistProfile,
  persistProfiles : persistProfiles
}

function findProfileBySteamId(id, res) {
  SteamUser
    .find({ steamid : id })
    .exec(function (err, user) {
      if (err)
        console.log(err.stack);
      res.send(user);
    })
}

function findProfilesWithPersonaHistory(res) {
  SteamUser
    .find({ $where: "this.personahistory.length > 0" })
    .exec(function(err, profiles) {
      if (err)
        console.log(err.stack);
      res.send(profiles);
    })
}

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

function persistProfiles(profiles, res) {
  var profileSteamIds = [];
  for (var i in profiles) {
    var profile = profiles[i];
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

module.exports = service;
