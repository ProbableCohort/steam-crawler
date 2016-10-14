/* global angular */
(function(angular) {
  angular.module('crawlerDirectives').directive('customButtonGroup', customButtonGroup);

  customButtonGroup.$inject = [];

  function customButtonGroup() {
      var directive = {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        templateUrl: 'javascripts/d/templates/customButtonGroup.html',
        view : '=ngModel'
      }

      return directive;

  }

})(angular);
