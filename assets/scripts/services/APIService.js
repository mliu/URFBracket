(function() {
  'use strict';

  var module = angular.module('APIService', []);

  module.factory('apiService', ['$rootScope', '$q', '$location', '$http', '$state', 'storageService', 'appConfig', function($rootScope, $q, $location, $http, $state, storageService, appConfig) {

    var apiService = {};

    apiService.user = null;
    apiService.token = null;
    apiService.isInitializing = false;

    apiService.isAuthorized = function() {
      if(apiService.token != null && apiService.user != null) {
        return true;
      }
      // For testing
      return true;
    }

    apiService.request = function(request, route, payload) {
      return $http({
        method: request,
        url: appConfig.API_BASE_URL+route,
        data: payload,
        headers: {'Authorization': 'Bearer ' + apiService.token}
      });
    }

    apiService.init = function() {
      if($rootScope.isInitialized) {
        return $q.when("");
      }
      if(apiService.isInitializing) {
        return apiService.promise;
      }
      apiService.token = storageService.get('auth.token');
      apiService.subscribeLoadEvents();
      apiService.isInitializing = true;
      apiService.promise = apiService.request('GET', '/me')
      .success(function(response) {
        apiService.user = response;
        $rootScope.isInitialized = true;
        if($location.path().indexOf('signin') != -1 || $location.path().indexOf('404') != -1){
          $state.go('app.bracket');
        }
      })
      .error(function() {
        storageService.clear('auth.token');
        apiService.token = null;
        $rootScope.isInitialized = true;
        if($location.path().indexOf('signin') == -1){
          $state.go('signin');
        }
      });
      return apiService.promise;
    }

    apiService.logout = function() {
      apiService.user = null;
      apiService.token = null;
      apiService.isInitializing = false;
      storageService.clear('auth.token');
      $state.go('signin');
    }

    return apiService;
  }]);
})();
