/* global angular */
(function(angular) {
  angular.module('crawlerDirectives').directive('steamUserMediaBadge', steamUserMediaBadge);

  steamUserMediaBadge.$inject = [];

  function steamUserMediaBadge() {
      var directive = {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        templateUrl: 'javascripts/d/templates/steamUserMediaBadge.html',
        scope: {
          steamUser : '=ngModel',
          col : '='
        },
        controller: ctrlFn,
        link : linkFn
      }

      return directive;

      /////////////////

      function linkFn(scope, el, attrs) {
        // scope - directive scope
        // scope.$parent - ng-repeat scope
        // scope.$parent.$parent - controller scope
        var controllerScope = scope.$parent;
        console.log(controllerScope.findPlayerInfo);
        if (!controllerScope.findPlayerInfo) {
          console.log('findPlayerInfo not found, restting controllerScope');
          controllerScope = scope.$parent.$parent;
          console.log(controllerScope.findPlayerInfo);
        }
        scope.findPlayerInfo = controllerScope.findPlayerInfo;
      }

      function ctrlFn($scope) {

        $scope.determinePersonaState = function(entity) {
          if (!entity)
            return;
          var state;
          var stateId = entity.personastate;
          switch(stateId) {
            case 0:
              state = "Offline";
              entity.status = 2;
              break;
            case 1:
              state = "Online";
              entity.status = 0;
              break;
            case 2:
              state = "Busy";
              entity.status = 2;
              break;
            case 3:
              state = "Away";
              entity.status = 1;
              break;
            case 4:
              state = "Snooze";
              entity.status = 2;
              break;
            case 5:
              state = "Looking To Trade";
              entity.status = 1;
              break;
            case 6:
              state = "Looking To Play";
              entity.status = 1;
              break;
            default:
              break;
          }
          return state;
        }

      }
  }

})(angular);
