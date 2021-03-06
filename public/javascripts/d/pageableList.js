/* global angular */
(function(angular) {
  angular.module('crawlerDirectives').directive('pageableList', pageableList);

  pageableList.$inject = [];

  function pageableList() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'javascripts/d/templates/pageableList.html',
      scope: {
        listSize: '=listSize',
        listStart: '=listStart',
        listLength: '=listLength',
        listType: '=listType',
        listIncrement: '=listIncrement'
      },
      transclude: {
        list: 'pageableListContents'
      },
      controller: controllerFn
    }

    return directive;

    /////////////////

    function controllerFn($scope) {
      $scope.listStart = 0;
      $scope.listLength = 10;
      $scope.smallestListSize = $scope.listLength;

      $scope.setListSize = function(size) {
        $scope.listStart = 0;
        $scope.listLength = size;
      }

      $scope.list = {
        size: {
          ten: {
            radio: 'ten',
            show: true,
            name: '10',
            onshow: $scope.setListSize,
            value: 10
          },
          twenty: {
            radio: 'twenty',
            show: false,
            name: '20',
            onshow: $scope.setListSize,
            value: 20
          },
          fifty: {
            radio: 'fifty',
            show: false,
            name: '50',
            onshow: $scope.setListSize,
            value: 50
          },
          hundred: {
            radio: 'hundred',
            show: false,
            name: '100',
            onshow: $scope.setListSize,
            value: 100
          }
        }
      }

      if ($scope.listIncrement) {
        $scope.listLength = $scope.listIncrement;
        $scope.smallestListSize = $scope.listLength;
        $scope.list.size = {}
        for (var i = 1; i <= 4; i++) {
          var thisSize = $scope.listIncrement * i * (i > 1 ? i - 1 : 1);
          $scope.list.size[thisSize.toString()] = {
            radio: thisSize.toString(),
            show: i === 1,
            name: thisSize.toString(),
            onshow: $scope.setListSize,
            value: thisSize
          }
        }
      }
    }
  }

})(angular);
