/* global angular */
(function(angular) {
  angular.module('crawlerControllers').controller('mainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$q', 'SteamApiService', 'CrawlerApiService'];

  function MainCtrl($scope, $q, SteamApiService, CrawlerApiService) {

    $scope.forms = {};
    $scope.history = [];

    $scope.stats = {};

    $scope.updateProfileCount = function() {
      CrawlerApiService.user().count(function(count) {
        $scope.stats.profileCount = count.profileCount;
      });
    }

    $scope.getRecent = function() {
      CrawlerApiService.user().last({ count : 9 }, function(data) {
        $scope.recent = data;
      });
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
        if ($scope.player && $scope.player.steamid)
          $scope.history.push($scope.player);
        SteamApiService.GetFriendList(id).query(function(friends) {
          if (!friends.length) {
            $scope.player = CrawlerApiService.user().save(player);
            $scope.updateProfileCount();
            $scope.getPlayerLevel($scope.player);
            $scope.searchResults = null;
            $scope.ready = true;
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
          show : false,
          name : 'View Recent Profiles',
          onShow : $scope.getRecent
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

    $scope.init = function() {
      $scope.getRecent();
      $scope.updateProfileCount();
    }

    $scope.init();

  }

})(angular);
