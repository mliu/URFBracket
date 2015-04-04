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

  .state('main', {
    url: '/auth/main',
    templateUrl: './templates/auth/main.html',
    controller: 'SigninCtrl as SigninCtrl',
    guestAccess: true
  })

  .state('signup', {
    url: '/auth/signup',
    templateUrl: './templates/auth/signup.html',
    controller: 'SignupCtrl as SignupCtrl',
    guestAccess: true
  })

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

  .state('app.home', {
    url: '/home',
    templateUrl: "./templates/social/index.html",
    controller: 'SocialHomeCtrl as SocialHomeCtrl',
    resolve: {
      userData: function(userPromise){
        return;
      }
    }
  })

  .state('app.marketplace', {
    url: '/marketplace',
    templateUrl: "./templates/marketplace/index.html",
    controller: 'MarketHomeCtrl as MarketHomeCtrl',
    guestAccess: true,
    resolve: {
      userData: function(userPromise){
        return;
      }
    }
  })

  .state('app.viewItem', {
    url: '/item/:item_id',
    templateUrl: "./templates/marketplace/item.html",
    controller: 'ItemDetailCtrl as ItemDetailCtrl',
    guestAccess: true,
    resolve: {
      userData: function(userPromise){
        return;
      }
    }
  })

  .state('app.admin', {
    url: '/admin',
    templateUrl: "./templates/admin/index.html",
    controller: 'AdminCtrl as AdminCtrl',
    requiresAdmin: true,
    resolve: {
      userData: function(userPromise){
        return;
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    abstract: true,
    template: "<div ui-view></div>",
    resolve: {
      userData: function(userPromise){
        return;
      }
    }
  })

  .state('app.profile.person', {
    url: '/:user_id',
    templateUrl: "./templates/profile/person.html",
    controller: 'SocialProfileCtrl as SocialProfileCtrl',
    resolve: {
      userData: function(userPromise){
        return;
      }
    }
  })

  .state('app.profile.settings', {
    url: '/settings',
    templateUrl: "./templates/profile/settings.html",
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

.filter('like_plural', function() {
  return function(num) {
    if(num > 1) {
      return num + " likes";
    }
    return "1 like";
  }
})

.run(['$rootScope', '$state', 'apiService', function($rootScope, $state, apiService) {
  apiService.init();

  if($rootScope.isInitialized){
    if(apiService.isAuthorized()) {
      if(next.requiresAdmin && apiService.isAdmin()) {
        event.preventDefault();
        $state.go('404');
      }
    } 
    else {
      // GUEST
      if(!next.guestAccess) {
        event.preventDefault();
        $state.go('signin');
      }
    }
  }
}]);
