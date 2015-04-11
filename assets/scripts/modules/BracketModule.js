(function() {
  'use strict';
  angular.module('BracketModule', [])

  .controller('BracketCtrl', ['$scope', 'apiService', function($scope, apiService) {
    var ctrl = this;
    $scope.api = apiService;
    $scope.depths = [1, 2, 4, 8, 15, 30, 60];
  }])

  .controller('LeaderBoardCtrl', ['$scope', 'apiService', function($scope, apiService) {
  	var ctrl = this;
  	$scope.api = apiService;
  }])
})();
