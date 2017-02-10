(function() {
  'use strict';

  angular.
    module('app').
    config(appStateConfig);

  appStateConfig.$inject = ['$locationProvider' ,'$stateProvider', '$urlRouterProvider'];
  function appStateConfig($locationProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $stateProvider.
      state('login', {
        url: '/login',
        views: {
          'main': {
            templateUrl: '/templates/login',
            controller: 'loginController',
            controllerAs: 'vm'
          }
        }
      }).
      state('home', {
        url: '/home',
        abstract: true,
        views: {
          'main': {
            templateUrl: '/templates/home',
            controller: 'homeController',
            controllerAs: 'vm'
          }
        }
      }).
      state('home.dashboard', {
        url: '/dashboard',
        views: {
          'content': {
            templateUrl: '/templates/dashboard',
            controller: 'homeDashboardController',
            controllerAs: 'vm'
          }
        }
      }).
      state('home.detail', {
        url: '/detail',
        views: {
          'content': {
            templateUrl: '/templates/detail',
            controller: 'homeDetailController',
            controllerAs: 'vm'
          }
        }
      });
    }
})();
