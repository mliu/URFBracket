(function() {
  'use strict';
  angular.module('BracketModule', [])

  .controller('BracketCtrl', ['$scope', 'apiService', function($scope, apiService) {

    var ctrl = this;
    $scope.api = apiService;
  }]);
})();
