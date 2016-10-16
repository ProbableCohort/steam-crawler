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
      avatarfull : "$avatarfull"
    }},
    activityhistory : {
      $addToSet : {
        personaname : "$personaname",
        avatarfull : "$avatarfull",
        personastate : "$personastate"
      }
    },
    friendsList : { $addToSet : "$friendsList" },
    views : { $addToSet : "$viewedAt" }
  }
}

var project = {
  $project : {
    "_id" : "$_id",
    "profile" : "$profile",
    "personahistory" : "$personahistory",
    "activityhistory" : "$activityhistory",
    "friendsList" : "$friendsList",
    "personahistorysize": { $size: "$personahistory" },
    "friendssize" : { $size: "$friendsList" },
    "timesviewed" : { $sum : "$viewed" }
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
  var project = {
    $project : {
      "_id" : "$_id",
      "profile" : "$profile",
      "personahistory" : "$personahistory",
      "activityhistory" : "$activityhistory",
      "friendsList" : "$friendsList",
      "timesviewed" : { $sum : "$viewed" }
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
      "activityhistory" : "$activityhistory",
      "friendsList" : "$friendsList",
      "timesviewed" : { $sum : "$views" }
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
      // "friendsList" : { $ne: [] }
      "viewedAt" : { $exists : true }
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

function findAllProfiles(req, res) {
  var sort = {
    $sort: {
      "profile.createdAt" : -1
    }
  }
  var match = { $match: {} };
  var limit = { $limit: 10 };
  if (req.query.sortBy) {
    var sortParam = req.query.sortBy;
    switch (req.query.sortBy) {
      case 'personahistory':
      case 'friends':
        sortParam = sortParam+'size';
        break;
      case 'timesviewed':
        sortParam = 'timesviewed'
        break;
      default:
        sortParam = 'profile.'+sortParam;
        break;
    }
    sort = {
      $sort: {}
    }
    sort.$sort[sortParam] = -1;
  }
  if (req.query.count) {
    var count = parseInt(req.query.count);
    limit = {
      $limit: count
    }
  }
  if (req.query.all) {
    limit = {
      $limit: {}
    }
  }
  var project = {
    $project: {
      "profile" : "$profile",
      "personahistory" : "$personahistory",
      "activityhistory" : "$activityhistory",
      "friendsList" : "$friendsList",
      "friendssize" : { $size: "$friendsList" },
      "personahistorysize": { $size: "$personahistory" },
      "timesviewed" : { $size : "$views" }
    }
  }

  var pipeline = [match, unwind, group, project, sort, limit];
  SteamUser
    .aggregate(pipeline)
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

function findProfilesWithPersonaHistory(count, res) {
  count = parseInt(count);
  var sort = {
    $sort: {
      "profile.createdAt" : -1
    }
  }
  var project = {
    $project: {
      "profile" : "$profile",
      "personahistory" : "$personahistory",
      "activityhistory" : "$activityhistory",
      "friendsList" : "$friendsList",
      "personahistorysize": { $size: "$personahistory" },
      "timesviewed" : { $sum : "$viewed" }
    }
  }
  var sortProject = {
    $sort: {
      "personahistorysize" : -1
    }
  }
  var limit = {
    $limit : count
  }
  SteamUser
    .aggregate([unwind, group, sort, project, sortProject, limit])
    .exec(function(err, users) {
      if (err)
        console.log(err.stack);
      var profiles = [];
      for (var i in users) {
        profiles.push(transformAggregateResponse(users[i]));
      }
      res.send(profiles);
    })
}

function persistProfile(profile, res) {
  profile.viewedAt = new Date();
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
  profile.activityhistory = response.activityhistory;
  profile.timesviewed = response.timesviewed;
  profile.friendsList = response.friendsList ? response.friendsList : null;
  return profile;
}

module.exports = service;
