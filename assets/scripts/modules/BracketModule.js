(function() {
  'use strict';
  angular.module('BracketModule', [])

  .controller('BracketCtrl', ['$scope', 'apiService', function($scope, apiService) {
    var ctrl = this;
    $scope.api = apiService;
    // $scope.depths = [1, 2, 4, 8, 16, 31, 62];
    $scope.depths = [1, 2, 4, 8, 15];
    $scope.data = {batch15: [4, 9, 2, 20, 5, 60, 8, 19, 22, 55, 1, 18, 3, 28, 6], batch8: [4, 2, 5, 8, 22, 1, 3, 6], batch4: [4, 8, 1, 3], batch2: [4, 1], batch1: [1]};
  }])

  .controller('LeaderBoardCtrl', ['$scope', 'apiService', function($scope, apiService) {
  	var ctrl = this;
  	$scope.api = apiService;
  }])
})();
