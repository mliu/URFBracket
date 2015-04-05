(function() {
  'use strict';
  angular.module('NavModule', [])

  .controller('NavCtrl', ['$scope', '$state', 'apiService', function($scope, $state, apiService) {

    var ctrl = this;
    $scope.api = apiService;
    $scope.$state = $state;
  }]);
})();
