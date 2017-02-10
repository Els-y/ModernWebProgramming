(function() {
  'use strict';

  angular.
    module('app').
    config(['$locationProvider' ,'$stateProvider', '$urlRouterProvider',
    function config($locationProvider, $stateProvider, $urlRouterProvider) {
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
            template: '<login-page layout="column" flex></login-page>'
          }
        }
      }).
      state('home', {
        url: '/home',
        abstract: true,
        views: {
          'main': {
            template: '<home-page layout="row" flex></home-page>'
          }
        }
      }).
      state('home.dashboard', {
        url: '/dashboard',
        views: {
          'content': {
            template: '<home-dashboard></home-dashboard>'
          }
        }
      }).
      state('home.detail', {
        url: '/detail',
        views: {
          'content': {
            template: '<home-detail></home-detail>'
          }
        }
      });
    }
  ]);
})();
