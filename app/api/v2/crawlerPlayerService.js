var request = require('request'),
  KEYS = require('../../../private/keys'),
  CrawlerApiService = require('./crawlerApiService'),
  SteamUserService = require('./steamUserService'),
  SteamPlayerService = require('./steamPlayerService');

var service = {
  getProfile: getProfile
}

function getProfile(id, refresh, cb) {
  CrawlerApiService.findProfileBySteamId(id, null, function(profile) {
    if (!profile || refresh) {
      SteamUserService.GetPlayerSummaries(id, null, function(profile) {
        populateProfile(profile[0], function(profile) {
          cb(profile);
        })
      })
    } else {
      populateProfile(profile, function(profile) {
        cb(profile);
      })
    }

  });

}

function populateProfile(profile, cb) {
  getSteamLevel(profile, function(profile) {
    getFriends(profile, function(profile) {
      updateProfile(profile, cb);
    })
  })
}

function updateProfile(profile, cb) {
  CrawlerApiService.persistProfile(profile, null, function(savedProfile) {
    savedProfile.friends = profile.friends;
    cb(savedProfile);
  });
}

function getSteamLevel(profile, cb) {
  SteamPlayerService.GetSteamLevel(profile.steamid, null, function(level) {
    profile.playerlevel = level;
    cb(profile);
  })
}

function populateFriends(profile, cb) {
  if (!profile.friendsList.length) {
    getFriends(profile, function(friends) {
      profile.friends = friends;
      cb(profile);
    })
  } else {
    CrawlerApiService.findProfilesBySteamIds(profile.friendsList, null, function(friends) {
      profile.friends = friends;
      if (friends.length < profile.friendsList.length) {
        getFriends(profile, function(friends) {
          profile.friends = friends;
          cb(profile);
        })
      } else {
        cb(profile);
      }
    });

  }
}

function getFriends(profile, cb) {
  SteamUserService.GetFriendList(profile.steamid, null, function(friends) {
    var friendsList = [];
    for (var i in friends) {
      friendsList.push(friends[i].steamid);
    }
    friendsList = shuffleArray(friendsList);
    profile.friendsList = friendsList;
    friendsList = friendsList.splice(0, 300);
    SteamUserService.GetPlayerSummaries(friendsList, null, function(players) {
      CrawlerApiService.persistProfiles(players, null, function(profiles) {
        CrawlerApiService.findProfilesBySteamIds(profile.friendsList, null, function(friends) {
          profile.friends = friends;
          cb(profile);
        })
      });

    })
  })

}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

module.exports = service;
