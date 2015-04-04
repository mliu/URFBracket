(function() {
  'use strict';
  angular.module('NavModule', [])

  .controller('NavCtrl', ['$scope', 'apiService', function($scope, apiService) {

    var ctrl = this;
    $scope.api = apiService;
  }]);
})();
