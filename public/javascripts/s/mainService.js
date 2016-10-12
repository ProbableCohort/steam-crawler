/* global angular */
(function(angular) {
  angular.module('crawlerServices').factory('MainService', MainService);

  MainService.$inject = ['$resource'];

  function MainService($resource) {

    var BASE_URI;

    var service = {
      player : player
    }

    return service;

    ///////////////

    function player() {
      checkURI();
      return $resource(BASE_URI + '/player');
    }

    function checkURI() {
      if (!BASE_URI || BASE_URI == '') {
        var e =  new Exception('BASE_URI IS NOT SET');
        throw e.message;
      }
    }
  }

})(angular);
