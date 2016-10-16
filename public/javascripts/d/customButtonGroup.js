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
        scope : {
          view : '=ngModel'
        },
        link : linkFn
      }

      return directive;

      /////////////////

      function linkFn(scope, el, attrs) {
        var isRadio = scope.isRadio = angular.isDefined(attrs.radio);

        scope.clearRadioState = function() {
          scope.radio.model = null;
        }
        scope.radio = {
          model: null
        }
        scope.$watch(function() {
          return scope.radio.model;
        }, function(n,o) {
          if (n) { scope.view[n].show = true; }
          if (o) { scope.view[o].show = false; }
        })
      }

  }

})(angular);
