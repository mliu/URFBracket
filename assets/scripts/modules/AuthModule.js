(function() {
	'use strict';
	angular.module('AuthModule', [])

	.controller('AuthCtrl', ['$scope', 'apiService', function($scope, apiService) {

		var ctrl = this;
		$scope.api = apiService;
		$scope.showSignin = true;

		$scope.signin = function () {
			$scope.isLoading = true;
			var payload = {
				username: $scope.username,
				password: $scope.password
			}
			apiService.request('POST', '/users', payload)
			.success(function(response) {
				$scope.isLoading = false;
			})
			.error(function(response) {
				$scope.isLoading = false;
				$scope.error = response.error;
			})
		}

		$scope.signup = function () {
			$scope.isLoading = true;
			var payload = {
				username: $scope.username,
				summoner: $scope.summoner,
				password: $scope.password
			}
			apiService.request('POST', '/users', payload)
			.success(function(response) {
				$scope.isLoading = false;
			})
			.error(function(response) {
				$scope.isLoading = false;
				$scope.error = response.error;
			})
		}
	}]);
})();
