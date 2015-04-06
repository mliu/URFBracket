(function() {
	'use strict';
	angular.module('AuthModule', [])

	.controller('AuthCtrl', ['$scope', '$state', 'apiService', function($scope, $state, apiService) {

		var ctrl = this;
		$scope.api = apiService;
		$scope.showSignin = true;

		$scope.signin = function () {
			$scope.isLoading = true;
			var payload = {
				username: $scope.username,
				password: $scope.password
			}
			apiService.request('POST', '/users/auth', payload)
			.success(function(response) {
				apiService.storeData(response.token, response.user);
				$scope.isLoading = false;
				$state.go('app.bracket');
			})
			.error(function(response) {
				$scope.isLoading = false;
				$scope.error = response.error;
			})
		}

		$scope.signup = function () {
			$scope.isLoading = true;
			var payload = {
				username: $scope.su_username,
				summoner: $scope.su_summoner,
				password: $scope.su_password
			}
			apiService.request('POST', '/users', payload)
			.success(function(response) {
				$scope.username = angular.copy($scope.su_username);
				$scope.password = angular.copy($scope.su_password);
				$scope.signin();
			})
			.error(function(response) {
				$scope.isLoading = false;
				$scope.error = response.error;
			})
		}
	}]);
})();
