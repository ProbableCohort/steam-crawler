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
      $scope.views.profilesLoading = true;
      CrawlerApiService.user().all({
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
      CrawlerApiService.user().query({
        personaname: name
      }, function(results) {
        $scope.searchResults = results;
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
          $scope.updateProfileCount();
        })
        $scope.friendsList.indexStart = 0;
        $scope.history.unshift($scope.player);
        $scope.searchResults = null;
        $scope.ready = true;
      })
    }

    $scope.setFriendsListSize = function(size) {
      $scope.friendsList.indexStart = 0;
      $scope.friendsList.indexLength = size;
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
          value: 'friends'
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
          value: 'personahistory'
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
          show: true,
          name: 'Search by SteamID'
        },
        history: {
          show: true,
          name: 'Show Search Results'
        }
      }
    }

    $scope.friendsList = {
      size: {
        ten: {
          radio: 'ten',
          show: true,
          name: '10',
          onshow: $scope.setFriendsListSize,
          value: 10
        },
        twenty: {
          radio: 'twenty',
          show: false,
          name: '20',
          onshow: $scope.setFriendsListSize,
          value: 20
        },
        fifty: {
          radio: 'fifty',
          show: false,
          name: '50',
          onshow: $scope.setFriendsListSize,
          value: 50
        },
        hundred: {
          radio: 'hundred',
          show: false,
          name: '100',
          onshow: $scope.setFriendsListSize,
          value: 100
        }
      },
      indexStart: 0,
      indexLength: 10
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
