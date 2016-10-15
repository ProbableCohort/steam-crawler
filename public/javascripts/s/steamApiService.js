/* global angular */
(function(angular) {
  angular.module('crawlerServices').factory('SteamApiService', SteamApiService);

  SteamApiService.$inject = ['$resource'];

  function SteamApiService($resource) {

    var BASE_URI = '/api/v1/steam'

    var service = {
      GetSchemaForGame : GetSchemaForGame,
      GetPlayerSummaries : GetPlayerSummaries,
      GetFriendList : GetFriendList
    }

    return service;

    ///////////////

    function GetSchemaForGame(id, callback) {
      var cb = callback || angular.noop;
      var URI = BASE_URI + '/stats/game/:id'
      var PARAMS = {id:id}
      return $resource(URI, PARAMS).get(cb);
    }

    function GetOwnedGames(id) {
      var URI = BASE_URI + '/player/:id'
      var PARAMS = {id:id}
      return $resource(URI, PARAMS).get();
    }

    function GetPlayerSummaries(id) {
      var URI = BASE_URI + '/user/:id'
      var PARAMS = {id:id}
      var transformResponse = function(d){
        d = JSON.parse(d);
        return d.response.players;
      }
      var ACTIONS = {
        'get' : {transformResponse:function(d) { return transformResponse(d)[0]; }},
        'query' : {transformResponse:transformResponse, isArray:true}
      }
      return $resource(URI, PARAMS, ACTIONS);
    }

    function GetFriendList(id) {
      var URI = BASE_URI + '/user/:id/friends'
      var PARAMS = {id:id}
      var transformResponse = function(d){
        d = JSON.parse(d);
        return d.friendslist ? d.friendslist.friends : [];
      }
      var ACTIONS = {
        'get' : {transformResponse:function(d) { return transformResponse(d)[0]; }},
        'query' : {transformResponse:transformResponse, isArray:true}
      }
      return $resource(URI, PARAMS, ACTIONS);
    }
  }

})(angular);
