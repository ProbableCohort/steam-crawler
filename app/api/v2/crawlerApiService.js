var SteamUser = require('../../models/steamUser');

var service = {
  findProfileBySteamId : findProfileBySteamId,
  findProfileByPersonaName : findProfileByPersonaName,
  findAllRecordsForProfileBySteamId : findAllRecordsForProfileBySteamId,
  findProfilesBySteamIds : findProfilesBySteamIds,
  findAllProfiles : findAllProfiles,
  findLastProfilesByCount : findLastProfilesByCount,
  countAllProfiles : countAllProfiles,
  findProfilesWithPersonaHistory : findProfilesWithPersonaHistory,
  persistProfile : persistProfile,
  persistProfiles : persistProfiles
}

var unwind = {
  $unwind: {
    path : "$friendsList",
    preserveNullAndEmptyArrays : true
  }
}

var group = {
  $group :{
    _id : "$steamid",
    profile : { $last : "$$ROOT" },
    personahistory : { $addToSet : {
      personaname : "$personaname",
      avatarfull : "$avatarfull",
      personastate : "$personastate"
    }},
    activityhistory : { $addToSet : {
      personastate : "$personastate"
    }},
    friendsList : { $addToSet : "$friendsList" }
  }
}

function findProfileBySteamId(id, res) {
  var match = {
    $match: {
      steamid: id,
    }
  }
  var sort = {
    $sort: {
      "profile.createdAt" : -1
    }
  }
  SteamUser
    .aggregate([match, unwind, group, sort])
    .exec(function (err, user) {
      if (err)
        console.log(err.stack);
      res.send(transformAggregateResponse(user[0]));
    })
}

function findProfileByPersonaName(name, res) {
  var match = {
    $match: {
      personaname : { $regex : name, $options : "i" }
    }
  }
  var unwindPersonaname = {
    $unwind: {
      path : "$personaname"
    }
  }
  var sort = {
    $sort: {
      "profile.createdAt" : -1
    }
  }
  SteamUser
    .aggregate([match, unwindPersonaname, match, unwind, group, sort])
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

function findAllRecordsForProfileBySteamId(id, res) {
  SteamUser
    .find({
      steamid: id,
    })
    .sort({
      "createdAt" : -1
    })
    .exec(function (err, records) {
      if (err)
        console.log(err.stack);
      res.send(records);
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
      "profile.createdAt" : -1
    }
  }
  var project = {
    $project: {
      "_id" : "$_id",
      "profile" : "$profile",
      "personahistory" : "$personahistory",
      "friendsList" : "$friendsList"
    }
  }
  SteamUser
    .aggregate([match, sort, unwind, group])
    .exec(function (err, users) {
      if (err)
        console.log(err.stack);
      console.log(users ? users.length : null);
      var profiles = [];
      for (var i in users) {
        profiles.push(transformAggregateResponse(users[i]));
      }
      res.send(profiles);
    })
}

function findLastProfilesByCount(count, res) {
  count = parseInt(count);
  var match = {
    $match: {
      "friendsList" : { $ne: [] }
    }
  }
  var sort = {
    $sort: {
      "profile.createdAt" : -1
    }
  }
  var limit = {
    $limit : count
  }
  SteamUser
    .aggregate([match, unwind, group, sort, limit])
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
      "profile.createdAt" : -1
    }
  }
  SteamUser
    .aggregate([unwind, group, sort])
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
  if (!response)
    return null;
  var profile = response.profile;
  profile._id = response._id;
  profile.personahistory = response.personahistory;
  response.friendsList ? profile.friendsList = response.friendsList : null;
  return profile;
}

module.exports = service;
