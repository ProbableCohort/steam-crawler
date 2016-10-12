/* global angular */
(function(angular) {
  angular.module('steamCrawlerApp', ['crawlerServices', 'crawlerControllers', 'ngResource']);

  angular.module('steamCrawlerApp').config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  });

  angular.module('steamCrawlerApp').config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
  ]);

  angular.module('crawlerServices', []);
  angular.module('crawlerControllers', []);

})(angular);
