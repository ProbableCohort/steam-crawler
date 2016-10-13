/* global angular */
(function(angular) {
  angular.module('crawlerDirectives').directive('steamPersonaHistoryDropdown', steamPersonaHistoryDropdown);

  steamPersonaHistoryDropdown.$inject = [];

  function steamPersonaHistoryDropdown() {
      var directive = {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        templateUrl: 'javascripts/d/templates/steamPersonaHistoryDropdown.html',
        scope: {
          personahistory : '=ngModel'
        }
      }

      return directive;
  }

})(angular);
