/* global angular */
(function(angular) {
  angular.module('crawlerControllers').controller('mainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$q', 'SteamApiService', 'CrawlerApiService'];

  function MainCtrl($scope, $q, SteamApiService, CrawlerApiService) {

    $scope.history = [];

    $scope.findPlayerInfo = function(id) {
      $scope.ready = false;
      if ($scope.player)
        $scope.history.push($scope.player);
      SteamApiService.GetPlayerSummaries(id).get(function(player) {

        SteamApiService.GetFriendList(id).query(function(friends) {
          if (!friends.length) {
            $scope.player = CrawlerApiService.user().save(player);
            $scope.ready = true;
            return;
          };
          var friendsIds = [];
          angular.forEach(friends, function(friend) {
            friendsIds.push(friend.steamid);
          })
          player.friends = SteamApiService.GetPlayerSummaries(friendsIds).query(function() {
            CrawlerApiService.user().saveAll(player.friends, function() {
              $scope.player = CrawlerApiService.user().save(player, function() {
                $scope.player.friends = CrawlerApiService.user().query({ ids : friendsIds.join(',') })
              });
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
      }
    }

    $scope.findPlayerInfo(76561197972363720);
  }

})(angular);
