/* global angular */
(function(angular) {
  angular.module('crawlerServices').factory('ServerApiService', ServerApiService);

  ServerApiService.$inject = ['$resource'];

  function ServerApiService($resource) {

    var BASE_URI = '/api/v1/server'

    var service = {
      version : version
    }

    return service;

    ///////////////

    function version() {
      var URI = BASE_URI + '/version'
      return $resource(URI);
    }

  }

})(angular);
