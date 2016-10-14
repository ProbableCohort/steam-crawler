var SteamUser = require('../../models/steamUser');

var service = {
  findProfileBySteamId : findProfileBySteamId,
  findProfilesBySteamIds : findProfilesBySteamIds,
  findAllProfiles : findAllProfiles,
  findLastProfilesByCount : findLastProfilesByCount,
  countAllProfiles : countAllProfiles,
  findProfilesWithPersonaHistory : findProfilesWithPersonaHistory,
  persistProfile : persistProfile,
  persistProfiles : persistProfiles
}

function findProfileBySteamId(id, res) {
  var match = {
    $match: {
      steamid: id,
    }
  }
  var sort = {
    $sort: {
      createdAt : -1
    }
  }
  var historyGroup = {
    $group :{
      _id : "$steamid",
      profile : { $first : "$$ROOT" },
      personahistory : { $addToSet : {
        personaname : "$personaname",
        avatarfull : "$avatarfull",
        personastate : "$personastate"
      }},
      activityhistory : { $addToSet : {
        personastate : "$personastate"
      }}
    }
  }
  var group = {
    $group: {
      _id : "$steamid",
      profile : { $first : "$$ROOT" },
      personahistory : { $push : "$$ROOT" }
    }
  }
  var project = {
    $project: {
      $_id : "$_id.steamid",
      personahistory : { $addToSet : "$_id" }
    }
  }
  SteamUser
    .aggregate([match, sort, historyGroup])
    .exec(function (err, user) {
      if (err)
        console.log(err.stack);
      res.send(transformAggregateResponse(user[0]));
    })
}

function findProfilesBySteamIds(ids, res) {
  var match = {
    $match: {
      $and : [
        { steamid: { $in : ids } }
      ]
    }
  }
  var sort = {
    $sort: {
      createdAt : -1
    }
  }
  var group = {
    $group :{
      _id : "$steamid",
      profile : { $first : "$$ROOT" },
      personahistory : { $addToSet : {
        personaname : "$personaname",
        avatarfull : "$avatarfull",
        personastate : "$personastate"
      }},
      activityhistory : { $addToSet : {
        personastate : "$personastate"
      }}
    }
  }
  SteamUser
    .aggregate([match, sort, group])
    .exec(function (err, users) {
      if (err)
        console.log(err.stack);
      var profiles = [];
      for (var i in users) {
        profiles.push(transformAggregateResponse(users[i]));
      }
      res.send(profiles);
    })
}

function findLastProfilesByCount(count, res) {
  count = parseInt(count);
  var sort = {
    $sort: {
      createdAt : -1
    }
  }
  var group = {
    $group: {
      _id : "$steamid",
      profile : { $first : "$$ROOT" },
      personahistory : { $push : "$$ROOT" }
    }
  }
  var limit = {
    $limit : count
  }
  SteamUser
    .aggregate([sort, group, sort, limit])
    .exec(function (err, users) {
      if (err)
        console.log(err.stack);
      var profiles = [];
      for (var i in users) {
        profiles.push(transformAggregateResponse(users[i]));
      }
      res.send(profiles);
    })
}

function findAllProfiles(res) {
  var sort = {
    $sort: {
      createdAt : -1
    }
  }
  var group = {
    $group: {
      _id : "$steamid",
      profile : { $first : "$$ROOT" },
      personahistory : { $push : "$$ROOT" }
    }
  }
  SteamUser
    .aggregate([sort, group])
    .exec(function (err, users) {
      if (err)
        console.log(err.stack);
      var profiles = [];
      for (var i in users) {
        profiles.push(transformAggregateResponse(users[i]));
      }
      res.send(profiles);
    })
}

function countAllProfiles(res) {
  SteamUser
    .distinct('steamid')
    .exec(function (err, count) {
      if (err)
        console.log(err.stack);
      var response = {
        profileCount : count.length
      }
      res.send(response);
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
    .create(profile, function (err, profile) {
      if (err)
        console.log(err);
      findProfileBySteamId(profile.steamid, res);
    })
}

function persistProfiles(profiles, res) {
  SteamUser
    .insertMany(profiles, function (err, profiles) {
      if (err)
        console.log(err);
      res.send(profiles);
    })
}

function transformAggregateResponse(response) {
  var profile = response.profile;
  profile._id = response._id;
  profile.personahistory = response.personahistory;
  return profile;
}

module.exports = service;
