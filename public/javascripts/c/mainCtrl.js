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

        $scope.player = CrawlerApiService.user().save(player);
        SteamApiService.GetFriendList(id).query(function(friends) {
          $scope.player.friends = [];
          if (!friends.length) {
            $scope.ready = true;
            return;
          };
          var friendsIds = [];
          angular.forEach(friends, function(friend) {
            friendsIds.push(friend.steamid);
          })
          player.friends = SteamApiService.GetPlayerSummaries(friendsIds).query(function() {
            $scope.player.friends = CrawlerApiService.user().saveAll(player.friends, function() {
              $scope.ready = true;
            });
          });
        });

      });
    }

    $scope.determinePersonaState = function(entity) {
      var state;
      var stateId = entity.personastate;
      switch(stateId) {
        case 0:
          state = "Offline";
          entity.status = 2;
          break;
        case 1:
          state = "Online";
          entity.status = 0;
          break;
        case 2:
          state = "Busy";
          entity.status = 2;
          break;
        case 3:
          state = "Away";
          entity.status = 1;
          break;
        case 4:
          state = "Snooze";
          entity.status = 2;
          break;
        case 5:
          state = "Looking To Trade";
          entity.status = 1;
          break;
        case 6:
          state = "Looking To Play";
          entity.status = 1;
          break;
        default:
          break;
      }
      return state;
    }

    $scope.findPlayerInfo(76561197972363720);
  }

})(angular);
