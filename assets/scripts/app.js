'use strict';

/**
 * @ngdoc overview
 * @name orApp
 * @description
 * # orApp
 *
 * Main module of the application.
 */
angular.module('LoLApp', [
    'ui.router',
    'ui.bootstrap',
    'AppConfig',
    //MODULES
    'NavModule',
    'AuthModule',
    'BracketModule',
    //SERVICES
    'APIService',
    'StorageService',
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '',
    abstract: true,
    templateUrl: "./templates/nav.html",
    controller: 'NavCtrl as NavCtrl',
    resolve: {
      userPromise: ['apiService', function(apiService) {
        return apiService.init();
      }]
    }
  })

  .state('app.signin', {
    url: '/signin',
    templateUrl: './templates/auth/signin.html',
    controller: 'AuthCtrl as AuthCtrl',
    guestAccess: true,
    resolve: {
      userData: function(userPromise){
        return;
      }
    }
  })

  .state('app.bracket', {
    url: '/bracket',
    templateUrl: "./templates/bracket/index.html",
    controller: 'BracketCtrl as BracketCtrl',
    resolve: {
      userData: function(userPromise){
        return;
      }
    }
  })

  .state('404', {
    url: '/404',
    templateUrl: "./404.html",
    guestAccess: true
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signin');
}])

.directive('spinner', function() {
  return {
    restrict: 'E',
    templateUrl: './templates/directives/spinner.html',
  }
})

.run(['$rootScope', '$state', 'apiService', function($rootScope, $state, apiService) {
  apiService.init();

  $rootScope.$on("$stateChangeStart", function(event, next, current) {
    if($rootScope.isInitialized){
      if(!apiService.isAuthorized()) {
        if(!next.guestAccess) {
          event.preventDefault();
          $state.go('app.signin');
        }
      }
    }
  })
}]);
