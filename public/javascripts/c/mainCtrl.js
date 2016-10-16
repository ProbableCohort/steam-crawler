/* global angular */
(function(angular) {
  angular.module('crawlerControllers').controller('mainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$q', 'SteamApiService', 'CrawlerApiService', 'ServerApiService'];

  function MainCtrl($scope, $q, SteamApiService, CrawlerApiService, ServerApiService) {

    $scope.appInfo = {};
    $scope.forms = {};
    $scope.history = [];

    $scope.stats = {};

    $scope.updateProfileCount = function() {
      CrawlerApiService.user().count(function(count) {
        $scope.stats.profileCount = count.profileCount;
      });
    }

    $scope.getProfiles = function(param, count) {
      CrawlerApiService.user().all({ sortBy: param, count: count}, function(data) {
        $scope.profiles = data;
      })
    }

    $scope.findPlayerByName = function(name) {
      if (!name || !name.length) { return; }
      CrawlerApiService.user().query({ personaname : name}, function(results) {
        $scope.searchResults = results;
      })
    }

    $scope.findPlayerInfo = function(id) {
      if (!id) { return; }
      $scope.ready = false;
      SteamApiService.GetPlayerSummaries(id).get(function(player) {
        if (!player.steamid) {
          $scope.searchResults = null;
          return;
        }
        SteamApiService.GetFriendList(id).query(function(friends) {
          if (!friends.length) {
            $scope.getPlayerLevel(player, function(player) {
              $scope.player = CrawlerApiService.user().save(player);
              $scope.history.unshift($scope.player);
              $scope.updateProfileCount();
              $scope.searchResults = null;
              $scope.ready = true;
            });
            return;
          };
          player.friendsList = [];
          angular.forEach(friends, function(friend) {
            player.friendsList.push(friend.steamid);
          })
          player.friends = SteamApiService.GetPlayerSummaries(player.friendsList).query(function() {
            $scope.getPlayerLevel(player, function(player) {
              CrawlerApiService.user().saveAll(player.friends, function() {
                $scope.player = CrawlerApiService.user().save(player, function() {
                  $scope.player.friends = CrawlerApiService.user().query({ ids : player.friendsList.join(',') })
                  $scope.history.unshift($scope.player);
                  $scope.updateProfileCount();
                });
                $scope.searchResults = null;
                $scope.ready = true;
              });
            });
          });
        });

      });
    }

    $scope.getPlayerLevel = function(player, cb) {
      if (player.level) { cb(player);return; }
      SteamApiService.GetSteamLevel(player.steamid).get(function(level) {
        player.playerlevel = level.player_level;
        if (typeof cb === 'function')
          cb(player);
      })
    }

    $scope.views = {
      result : {
        profile : {
          show : false,
          name : 'View Profile'
        },
        friends : {
          show : true,
          name : 'View Friends'
        }
      },
      general : {
        recent : {
          radio : 'recent',
          show : false,
          name : 'Recently Updated',
          onShow : $scope.getProfiles,
          value : 'viewedAt'
        },
        mostViewed : {
          radio : 'mostViewed',
          show : false,
          name : 'Most Viewed',
          onShow : $scope.getProfiles,
          value : 'timesviewed'
        },
        friends : {
          radio : 'friends',
          show : false,
          name : 'Most Friends',
          onShow : $scope.getProfiles,
          value : 'friends'
        },
        level : {
          radio : 'level',
          show : false,
          name : 'Highest Level',
          onShow : $scope.getProfiles,
          value : 'playerlevel'
        }
      },
      search : {
        steamName : {
          show : true,
          name : 'Search by Steam Name'
        },
        playerId : {
          show : true,
          name : 'Search by SteamID'
        }
      }
    }

    $scope.getAppInfo = function() {
      var legalText = [
        "All of this stuff is from Steam through the Web API. ",
        "By using this service you agree not to do anything bad to our stuff or theirs, and accept the data 'as-is'. ",
        "Don't be a jackass."
      ]
      $scope.appInfo.legalText = legalText.join('');
      ServerApiService.version().get(function(d) {
        $scope.appInfo.version = d.version;
      });
    }

    $scope.init = function() {
      $scope.getAppInfo();
      $scope.updateProfileCount();
    }

    $scope.init();

  }

})(angular);
