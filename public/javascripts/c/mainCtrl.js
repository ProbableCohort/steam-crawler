/* global angular */
(function(angular) {
  angular.module('crawlerControllers').controller('mainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$q', 'SteamApiService', 'CrawlerApiService'];

  function MainCtrl($scope, $q, SteamApiService, CrawlerApiService) {

    $scope.findPlayerInfo = function(id) {
      SteamApiService.GetPlayerSummaries(id).get(function(player) {

        $scope.player = CrawlerApiService.user().save(player, function() {
          console.log($scope.player);
        });
        SteamApiService.GetFriendList(id).query(function(friends) {
          player.friends = [];
          if (!friends.length) {
            return;
          };
          var friendsIds = [];
          angular.forEach(friends, function(friend) {
            friendsIds.push(friend.steamid);
          })
          player.friends = SteamApiService.GetPlayerSummaries(friendsIds).query(function() {
            $scope.player.friends = CrawlerApiService.user().saveAll(player.friends);
          });
        });
      });
    }

    $scope.determinePersonaState = function(stateId) {
      var state;
      switch(stateId) {
        case 0:
          state = "Offline";
          $scope.player.status = 'RED';
          break;
        case 1:
          state = "Online";
          $scope.player.status = 'GREEN';
          break;
        case 2:
          state = "Busy";
          $scope.player.status = 'RED';
          break;
        case 3:
          state = "Away";
          $scope.player.status = 'YELLOW';
          break;
        case 4:
          state = "Snooze";
          $scope.player.status = 'RED';
          break;
        case 5:
          state = "Looking To Trade";
          $scope.player.status = 'GREEN';
          break;
        case 6:
          state = "Looking To Play";
          $scope.player.status = 'GREEN';
          break;
        default:
          break;
      }
      return state;
    }

    $scope.player = {
      steamid : 76561197972363720
    }
    $scope.findPlayerInfo(76561197972363720);
  }

})(angular);
