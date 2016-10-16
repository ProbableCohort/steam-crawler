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
        // scope.$parent - controller scope
        var controllerScope = scope.$parent;
        if (!controllerScope.findPlayerInfo) {
          // scope.$parent - ng-repeat scope
          // scope.$parent.$parent - controller scope
          controllerScope = scope.$parent.$parent;
        }
        scope.findPlayerInfo = controllerScope.findPlayerInfo;

        scope.small = angular.isDefined(attrs.small);
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

        $scope.getLevelColor = function(level) {
          var selector = '';
          switch(true) {
            case (level < 10):
              break;
            case (level < 20):
              selector = 'steam-level-green';
              break;
            case (level < 30):
              selector = 'steam-level-yellow';
              break;
            case (level < 40):
              selector = 'steam-level-red'
              break;
            case (level < 50):
              selector = 'steam-level-purple'
              break;
            case (level < 100):
              selector = 'steam-level-orange';
              break;
            case (level < 500):
              selector = 'steam-level-epic';
              break;
            case (level >= 500):
              selector = 'steam-level-legendary';
              break;
            default:
              break;
          }
          return selector;
        }

      }
  }

})(angular);
