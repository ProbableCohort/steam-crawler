/* global angular */
(function(angular) {
  angular.module('crawlerControllers').controller('mainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$q', 'SteamApiService', 'CrawlerApiService', 'ServerApiService'];

  function MainCtrl($scope, $q, SteamApiService, CrawlerApiService, ServerApiService) {

    $scope.appInfo = {};
    $scope.forms = {};
    $scope.history = [];
    $scope.search = {};
    $scope.lists = {};

    $scope.stats = {};

    $scope.updateProfileCount = function() {
      CrawlerApiService.user().count(function(count) {
        $scope.stats.profileCount = count.profileCount;
      });
    }

    $scope.getProfiles = function(param, count) {
      $scope.views.profilesLoading = true;
      CrawlerApiService.profile().all({
        sortBy: param,
        count: count
      }, function(data) {
        $scope.profiles = data;
        $scope.views.profilesLoading = false;
      })
    }

    $scope.findPlayerByName = function(name) {
      if (!name || !name.length) {
        return;
      }
      $scope.search.running = true;
      CrawlerApiService.user().query({
        personaname: name
      }, function(results) {
        if ($scope.search.personaname === name) {
          $scope.searchResults = results;
          $scope.search.running = false;
        }
      })
    }

    $scope.findPlayerInfo = function(id, refresh) {
      if (!id) {
        return;
      }
      $scope.ready = false;
      CrawlerApiService.profile(id).get({
        withFriends: true
      }, function(player) {
        $scope.player = player;
        $scope.player.friendsLoaded = true;
      })
      $scope.player = CrawlerApiService.profile(id).get(function(player) {
        $scope.player.updatingProfile = true;
        CrawlerApiService.profile(id).get({
          refresh: true
        }, function(player) {
          $scope.player = player;
          $scope.player.profileUpdated = true;
          $scope.lists.friends.indexStart = 0;
          $scope.updateProfileCount();
        })
        $scope.lists.friends.indexStart = 0;
        $scope.history.unshift($scope.player);
        $scope.searchResults = null;
        $scope.ready = true;
      })
    }

    $scope.views = {
      result: {
        profile: {
          show: false,
          name: 'View Profile'
        },
        friends: {
          show: true,
          name: 'View Friends'
        }
      },
      general: {
        recent: {
          radio: 'recent',
          show: false,
          name: 'Recently Updated',
          onshow: $scope.getProfiles,
          value: 'viewedAt'
        },
        mostViewed: {
          radio: 'mostViewed',
          show: false,
          name: 'Most Viewed',
          onshow: $scope.getProfiles,
          value: 'timesviewed'
        },
        friends: {
          radio: 'friends',
          show: false,
          name: 'Most Friends',
          onshow: $scope.getProfiles,
          value: 'friendssize'
        },
        level: {
          radio: 'level',
          show: false,
          name: 'Highest Level',
          onshow: $scope.getProfiles,
          value: 'playerlevel'
        },
        mostPersonas: {
          radio: 'mostPersonas',
          show: false,
          name: 'Most Personas',
          onshow: $scope.getProfiles,
          value: 'personahistorysize'
        },
        mostGames: {
          radio: 'mostGames',
          show: false,
          name: 'Most Games',
          onshow: $scope.getProfiles,
          value: 'gamescount'
        }
      },
      search: {
        steamName: {
          show: true,
          name: 'Search by Steam Name'
        },
        playerId: {
          show: false,
          name: 'Search by SteamID'
        },
        history: {
          show: true,
          name: 'Show Recently Viewed Profiles'
        }

      }
    }

    $scope.determinePersonaState = function(entity) {
      if (!entity)
        return;
      var stateId = entity.personastate;
      switch (stateId) {
        case 0:
          status = 6;
          break;
        case 1:
          status = 0;
          break;
        case 2:
          status = 4;
          break;
        case 3:
          status = 3;
          break;
        case 4:
          status = 5;
          break;
        case 5:
          status = 2;
          break;
        case 6:
          status = 1;
          break;
        default:
          break;
      }
      return status;
    }

    $scope.getAppInfo = function() {
      var legalText = [
        "This product is in no way affiliated with or endorsed by Valve or Steam. ",
        "All data is gathered through the Steam Web API. ",
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
