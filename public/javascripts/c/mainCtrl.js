/* global angular */
(function(angular) {
  angular.module('crawlerControllers').controller('mainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$q', 'SteamApiService', 'CrawlerApiService'];

  function MainCtrl($scope, $q, SteamApiService, CrawlerApiService) {

    $scope.history = [];

    $scope.getRecent = function() {
      CrawlerApiService.user().last({ count : 9 }, function(data) {
        $scope.recent = data;
      });
    }

    $scope.findPlayerByName = function(name) {
      CrawlerApiService.user().query({ personaname : name}, function(results) {
        $scope.searchResults = results;
        console.log(results);
      })
    }

    $scope.findPlayerInfo = function(id) {
      $scope.ready = false;
      if ($scope.player && $scope.player.steamid)
        $scope.history.push($scope.player);
      SteamApiService.GetPlayerSummaries(id).get(function(player) {

        SteamApiService.GetFriendList(id).query(function(friends) {
          if (!friends.length) {
            $scope.player = CrawlerApiService.user().save(player);
            $scope.searchResults = null;
            $scope.ready = true;
            return;
          };
          player.friendsList = [];
          angular.forEach(friends, function(friend) {
            player.friendsList.push(friend.steamid);
          })
          player.friends = SteamApiService.GetPlayerSummaries(player.friendsList).query(function() {
            CrawlerApiService.user().saveAll(player.friends, function() {
              $scope.player = CrawlerApiService.user().save(player, function() {
                $scope.player.friends = CrawlerApiService.user().query({ ids : player.friendsList.join(',') })
              });
              $scope.searchResults = null;
              $scope.ready = true;
            });
          });
        });

      });
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
          show : true,
          name : 'View Recent Profiles'
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
    }

    $scope.init();

  }

})(angular);
