/* global angular */
(function(angular) {
  angular.module('crawlerServices').factory('CrawlerApiService', CrawlerApiService);

  CrawlerApiService.$inject = ['$resource'];

  function CrawlerApiService($resource) {

    var BASE_URI = '/api/v2/crawler'

    var service = {
      user : user
    }

    return service;

    ///////////////

    function user(id) {
      var URI = BASE_URI + '/user/:action/:id';
      var PARAMS = {};
      var OPTIONS = {
        'saveAll' : {
          method : 'POST',
          isArray : true
        },
        'last' : {
          method : 'GET',
          params : {
            action : 'last'
          },
          isArray : true
        },
        'all' : {
          method : 'GET',
          params : {
            action : 'all'
          }
        }
      }
      return $resource(URI, PARAMS, OPTIONS);
    }

  }

})(angular);
