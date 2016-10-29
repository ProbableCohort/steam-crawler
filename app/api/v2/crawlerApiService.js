var SteamUser = require('../../models/steamUser');

var service = {
  findProfileBySteamId: findProfileBySteamId,
  findProfileByPersonaName: findProfileByPersonaName,
  findAllRecordsForProfileBySteamId: findAllRecordsForProfileBySteamId,
  findProfilesBySteamIds: findProfilesBySteamIds,
  findAllProfiles: findAllProfiles,
  findLastProfilesByCount: findLastProfilesByCount,
  countAllProfiles: countAllProfiles,
  findProfilesWithPersonaHistory: findProfilesWithPersonaHistory,
  persistProfile: persistProfile,
  persistProfiles: persistProfiles
}

////////////////////////////////////////

var unwind = {
  $unwind: {
    path: "$friendsList",
    preserveNullAndEmptyArrays: true
  }
}

var group = {
  $group: {
    _id: "$steamid",
    profile: {
      $last: "$$ROOT"
    },
    playerlevel: {
      $max: "$playerlevel"
    },
    personahistory: {
      $addToSet: {
        personaname: "$personaname",
        avatarfull: "$avatarfull"
      }
    },
    activityhistory: {
      $addToSet: {
        personaname: "$personaname",
        avatarfull: "$avatarfull",
        personastate: "$personastate"
      }
    },
    friendsList: {
      $addToSet: "$friendsList"
    },
    views: {
      $addToSet: "$viewedAt"
    },
    playerlevel: {
      $max: "$playerlevel"
    }
  }
}

var project = {
  $project: {
    "_id": "$_id",
    "profile": "$profile",
    "personahistory": "$personahistory",
    "activityhistory": "$activityhistory",
    "friendsList": "$friendsList",
    "playerlevel": "$playerlevel",
    "personahistorysize": {
      $size: "$personahistory"
    },
    "friendssize": {
      $size: "$friendsList"
    },
    "timesviewed": {
      $size: "$views"
    },
    "playerlevel": "$playerlevel"
  }
}

function findProfileBySteamId(id, res, cb) {
  var match = {
    $match: {
      steamid: id,
    }
  }
  var sort = {
    $sort: {
      "profile.createdAt": -1
    }
  }
  SteamUser
    .aggregate([match, unwind, group, project, sort])
    .allowDiskUse(true)
    .exec(function(err, user) {
      if (err)
        console.log(err.stack);
      if (cb && typeof cb === 'function') {
        cb(transformAggregateResponse(user[0]));
        return;
      }
      res.send(transformAggregateResponse(user[0]));
    })
}

function findProfileByPersonaName(name, res) {
  var match = {
    $match: {
      personaname: {
        $regex: name,
        $options: "i"
      }
    }
  }
  var unwindPersonaname = {
    $unwind: {
      path: "$personaname"
    }
  }
  var sort = {
    $sort: {
      "profile.createdAt": -1
    }
  }
  SteamUser
    .aggregate([match, unwindPersonaname, match, unwind, group, sort])
    .allowDiskUse(true)
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

function findAllRecordsForProfileBySteamId(id, res) {
  SteamUser
    .find({
      steamid: id,
    })
    .sort({
      "createdAt": -1
    })
    .exec(function(err, records) {
      if (err)
        console.log(err.stack);
      res.send(records);
    })
}

function findProfilesBySteamIds(ids, res, cb) {
  var match = {
    $match: {
      $and: [{
        steamid: {
          $in: ids
        }
      }]
    }
  }
  var sort = {
    $sort: {
      "profile.createdAt": -1
    }
  }
  SteamUser
    .aggregate([match, sort, unwind, group])
    .allowDiskUse(true)
    .exec(function(err, users) {
      if (err)
        console.log(err.stack);
      var profiles = [];
      for (var i in users) {
        profiles.push(transformAggregateResponse(users[i]));
      }
      if (cb && typeof cb === 'function') {
        cb(profiles);
        return;
      }
      res.send(profiles);
    })
}

function findLastProfilesByCount(count, res) {
  count = parseInt(count);
  var match = {
    $match: {
      // "friendsList" : { $ne: [] }
      "viewedAt": {
        $exists: true
      }
    }
  }
  var sort = {
    $sort: {
      "profile.createdAt": -1
    }
  }
  var limit = {
    $limit: count
  }
  SteamUser
    .aggregate([match, unwind, group, sort, limit])
    .allowDiskUse(true)
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

function findAllProfiles(req, res) {
  var sort = {
    $sort: {
      "profile.createdAt": -1
    }
  }
  var match = {
    $match: {}
  }
  var limit = {
    $limit: 10
  }
  if (req.query.sortBy) {
    var sortParam = req.query.sortBy;
    switch (req.query.sortBy) {
      case 'personahistory':
      case 'friends':
        sortParam = sortParam + 'size';
        break;
      case 'timesviewed':
      case 'playerlevel':
        break;
      default:
        sortParam = 'profile.' + sortParam;
        break;
    }
    sort = {
      $sort: {}
    }
    sort.$sort[sortParam] = -1;
    sort.$sort['profile.createdAt'] = -1;
  }
  if (req.query.count) {
    var count = parseInt(req.query.count);
    limit = {
      $limit: count
    }
  }

  var pipeline = [match, unwind, group, project, sort];
  if (!req.query.all) {
    pipeline.push(limit);
  }
  SteamUser
    .aggregate(pipeline)
    .allowDiskUse(true)
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

function countAllProfiles(res) {
  SteamUser
    .distinct('steamid')
    .exec(function(err, count) {
      if (err)
        console.log(err.stack);
      var response = {
        profileCount: count.length
      }
      res.send(response);
    })
}

function findProfilesWithPersonaHistory(count, res) {
  count = parseInt(count);
  var sort = {
    $sort: {
      "profile.createdAt": -1
    }
  }
  var project = {
    $project: {
      "profile": "$profile",
      "personahistory": "$personahistory",
      "activityhistory": "$activityhistory",
      "friendsList": "$friendsList",
      "personahistorysize": {
        $size: "$personahistory"
      },
      "timesviewed": {
        $sum: "$viewed"
      }
    }
  }
  var sortProject = {
    $sort: {
      "personahistorysize": -1
    }
  }
  var limit = {
    $limit: count
  }
  SteamUser
    .aggregate([unwind, group, sort, project, sortProject, limit])
    .allowDiskUse(true)
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

function persistProfile(profile, res, cb) {
  delete profile._id;
  delete profile.createdAt;
  delete profile.updatedAt;
  profile.viewedAt = new Date();
  console.log(profile);
  SteamUser
    .create(profile, function(err, profile) {
      if (err)
        console.log(err.stack);
      findProfileBySteamId(profile.steamid, res, cb);
    })
}

function persistProfiles(profiles, res, cb) {
  SteamUser
    .insertMany(profiles, function(err, profiles) {
      if (err)
        console.log(err.stack);
      if (cb && typeof cb === 'function') {
        cb(profiles);
        return;
      }
      res.send(profiles);
    })
}

function transformAggregateResponse(response) {
  if (!response)
    return null;
  var profile = response.profile;
  profile._id = response._id;
  profile.friends = response.friends;
  profile.personahistory = response.personahistory;
  profile.activityhistory = response.activityhistory;
  profile.timesviewed = response.timesviewed;
  profile.playerlevel = response.playerlevel;
  profile.friendsList = response.friendsList ? response.friendsList : null;
  return profile;
}

module.exports = service;
