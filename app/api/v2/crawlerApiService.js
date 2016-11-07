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

var unwindFriends = {
  $unwind: {
    path: "$friendsList",
    preserveNullAndEmptyArrays: true
  }
}

var unwindGames = {
  $unwind: {
    path: "$games",
    preserveNullAndEmptyArrays: true
  }
}

var group = {
  $group: {
    _id: "$steamid",
    "steamid": {
      $last: "$steamid"
    },
    "personaname": {
      $last: "$personaname"
    },
    "avatarfull": {
      $last: "$avatarfull"
    },
    "createdAt": {
      $last: "$createdAt"
    },
    "lastlogoff": {
      $last: "$lastlogoff"
    },
    "viewedAt": {
      $last: "$viewedAt"
    },
    "gameid": {
      $last: "$gameid"
    },
    "gameextrainfo": {
      $last: "$gameextrainfo"
    },
    "communityvisibilitystate": {
      $last: "$communityvisibilitystate"
    },
    "personastate": {
      $last: "$personastate"
    },
    "profilestate": {
      $last: "$profilestate"
    },
    "primaryclanid": {
      $last: "$primaryclanid"
    },
    "realname": {
      $last: "$realname"
    },
    playerlevel: {
      $max: "$playerlevel"
    },
    gamescount: {
      $max: "$gamescount"
    },
    personahistory: {
      $addToSet: {
        personaname: "$personaname",
        avatarfull: "$avatarfull"
      }
    },
    friendsList: {
      $addToSet: "$friendsList"
    },
    views: {
      $addToSet: "$viewedAt"
    },
    viewedAt: {
      $last: "$viewedAt"
    }
  }

}

var project = {
  $project: {
    "_id": "$_id",
    "steamid": "$steamid",
    "personaname": "$personaname",
    "avatarfull": "$avatarfull",
    "createdAt": "$createdAt",
    "lastlogoff": "$lastlogoff",
    "viewedAt": "$viewedAt",
    "communityvisibilitystate": "$communityvisibilitystate",
    "gameid": "$gameid",
    "gameextrainfo": "$gameextrainfo",
    "personastate": "$personastate",
    "profilestate": "$profilestate",
    "primaryclanid": "$primaryclanid",
    "realname": "$realname",
    "personahistory": "$personahistory",
    "friendsList": "$friendsList",
    "playerlevel": "$playerlevel",
    "gamescount": "$gamescount",
    "personahistorysize": {
      $size: "$personahistory"
    },
    "friendssize": {
      $size: "$friendsList"
    },
    "timesviewed": {
      $size: "$views"
    }
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
      "createdAt": -1
    }
  }
  SteamUser
    .aggregate([match, unwindFriends, group, project, sort])
    .allowDiskUse(true)
    .exec(function(err, user) {
      if (err)
        console.log(err.stack);
      if (cb && typeof cb === 'function') {
        cb(user[0]);
        return;
      }
      res.send(user[0]);
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
      "createdAt": -1
    }
  }
  SteamUser
    .aggregate([match, unwindPersonaname, match, unwindFriends, group, project, sort])
    .allowDiskUse(true)
    .exec(function(err, users) {
      if (err)
        console.log(err.stack);
      var profiles = [];
      for (var i in users) {
        profiles.push(users[i]);
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
      "createdAt": -1
    }
  }
  SteamUser
    .aggregate([match, unwindFriends, group, project, sort])
    .allowDiskUse(true)
    .exec(function(err, users) {
      if (err)
        console.log(err.stack);
      var profiles = [];
      for (var i in users) {
        profiles.push(users[i]);
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
      "createdAt": -1
    }
  }
  var limit = {
    $limit: count
  }
  SteamUser
    .aggregate([match, unwindFriends, group, sort, limit])
    .allowDiskUse(true)
    .exec(function(err, users) {
      if (err)
        console.log(err.stack);
      var profiles = [];
      for (var i in users) {
        profiles.push(users[i]);
      }
      res.send(profiles);
    })
}

function findAllProfiles(req, res, cb) {
  console.log('[' + new Date().getTime() + ']' + 'findAllProfiles running');
  var sort = {
    $sort: {
      "createdAt": -1
    }
  }
  var match = {
    $match: {}
  }
  var limit = {
    $limit: 10
  }

  var group = {
    $group: {
      _id: "$steamid",
      "steamid": {
        $last: "$steamid"
      },
      "createdAt": {
        $last: "$createdAt"
      }
    }
  }

  var project = {
    $project: {
      "_id": "$_id",
      "steamid": "$steamid",
      "createdAt": "$createdAt"
    }
  }
  if (req.query.sortBy) {
    var sortParam = req.query.sortBy;
    switch (req.query.sortBy) {
      case 'personahistorysize':
        group.$group['personahistory'] = {
          $addToSet: {
            personaname: "$personaname",
            avatarfull: "$avatarfull"
          }
        }
        project.$project['personahistorysize'] = {
          $size: "$personahistory"
        }
        break;
      case 'friendssize':
        group.$group['friendsList'] = {
          $addToSet: "$friendsList"
        }
        project.$project['friendssize'] = {
          $size: "$friendsList"
        }
        break;
      case 'timesviewed':
        group.$group['views'] = {
          $addToSet: "$viewedAt"
        }
        project.$project['timesviewed'] = {
          $size: "$views"
        }
        break;
      case 'playerlevel':
        group.$group['playerlevel'] = {
          $max: "$playerlevel"
        }
        project.$project['playerlevel'] = "$playerlevel";
        break;
      case 'gamescount':
        group.$group['gamescount'] = {
          $max: "$gamescount"
        }
        project.$project['gamescount'] = "$gamescount";
        break;
      case 'viewedAt':
        match = {
          $match: {
            viewedAt: {
              $exists: true
            }
          }
        }
        group.$group['viewedAt'] = {
          $first: '$viewedAt'
        }
        project.$project['viewedAt'] = "$viewedAt";
        break;
      default:
        break;
    }
    sort = {
      $sort: {}
    }
    sort.$sort[sortParam] = -1;
    sort.$sort['createdAt'] = -1;
  }
  if (req.query.count) {
    var count = parseInt(req.query.count);
    limit = {
      $limit: count
    }
  }

  var pipeline = [match, unwindFriends, group, project, sort];
  if (!req.query.all) {
    pipeline.push(limit);
  }
  var aggregateStartTime = new Date().getTime();
  console.log('[' + aggregateStartTime + ']' + 'findAllProfiles aggregate begins');
  SteamUser
    .aggregate(pipeline)
    .allowDiskUse(true)
    .exec(function(err, users) {
      if (err)
        console.log(err.stack);
      var aggregateEndTime = new Date().getTime();
      console.log('[' + aggregateEndTime + ']' + 'findAllProfiles aggregate ends');
      console.log('[' + aggregateEndTime + ']' + 'findAllProfiles aggregate lasted ' + (aggregateEndTime - aggregateStartTime) + 'ms');
      if (cb)
        return cb(users);
      res.send(users);
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
      "createdAt": -1
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
    .aggregate([unwindFriends, group, sort, project, sortProject, limit])
    .allowDiskUse(true)
    .exec(function(err, users) {
      if (err)
        console.log(err.stack);
      var profiles = [];
      for (var i in users) {
        profiles.push(users[i]);
      }
      res.send(profiles);
    })
}

function persistProfile(profile, res, cb) {
  delete profile._id;
  delete profile.createdAt;
  delete profile.updatedAt;
  profile.viewedAt = new Date();
  SteamUser
    .create(profile, function(err, profile) {
      if (err)
        console.log(err.stack);
      findProfileBySteamId(profile.steamid, res, cb);
    })
}

function persistProfiles(profiles, res, cb) {
  if (!profiles || !profiles.length) {
    return cb(profiles)
  }
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

module.exports = service;
