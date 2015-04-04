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
    //SERVICES
    'APIService',
    'StorageService',
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('signin', {
    url: '/auth/signin',
    templateUrl: './templates/auth/signin.html',
    controller: 'SigninCtrl as SigninCtrl',
    guestAccess: true
  })

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

  .state('app.bracket', {
    url: '/home',
    templateUrl: "./templates/social/index.html",
    controller: 'SocialHomeCtrl as SocialHomeCtrl',
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
  $urlRouterProvider.otherwise('/404');
}])

.directive('spinner', function() {
  return {
    restrict: 'E',
    templateUrl: './templates/_directives/spinner.html',
  }
})

.run(['$rootScope', '$state', 'apiService', function($rootScope, $state, apiService) {
  // apiService.init();

  if($rootScope.isInitialized){
    if(!apiService.isAuthorized()) {
      // GUEST
      if(!next.guestAccess) {
        event.preventDefault();
        $state.go('signin');
      }
    }
  }
}]);
