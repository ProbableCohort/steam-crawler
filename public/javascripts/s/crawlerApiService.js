/* global angular */
(function(angular) {
  angular.module('crawlerServices').factory('CrawlerApiService', CrawlerApiService);

  CrawlerApiService.$inject = ['$resource'];

  function CrawlerApiService($resource) {

    var BASE_URI = '/api/v2/crawler'

    var service = {
      profile: profile,
      user: user
    }

    return service;

    ///////////////

    function profile(id) {
      var URI = BASE_URI + '/player/:action/:id';
      var PARAMS = {
        id: id
      };
      var OPTIONS = {
        'saveAll': {
          method: 'POST',
          isArray: true
        },
        'last': {
          method: 'GET',
          params: {
            action: 'last'
          },
          isArray: true
        },
        'all': {
          method: 'GET',
          params: {
            action: 'all'
          },
          isArray: true
        },
        'count': {
          method: 'GET',
          params: {
            action: 'all',
            id: 'count'
          }
        }
      }
      return $resource(URI, PARAMS, OPTIONS);
    }

    function user(id) {
      var URI = BASE_URI + '/user/:action/:id';
      var PARAMS = {};
      var OPTIONS = {
        'saveAll': {
          method: 'POST',
          isArray: true
        },
        'last': {
          method: 'GET',
          params: {
            action: 'last'
          },
          isArray: true
        },
        'all': {
          method: 'GET',
          params: {
            action: 'all'
          },
          isArray: true
        },
        'count': {
          method: 'GET',
          params: {
            action: 'all',
            id: 'count'
          }
        }
      }
      return $resource(URI, PARAMS, OPTIONS);
    }

  }

})(angular);
