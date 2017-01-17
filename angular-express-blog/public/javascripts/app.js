// 'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', ]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/index',
        controller: IndexCtrl
      }).
      when('/addPost', {
        templateUrl: '/partials/addPost',
        controller: AddPostCtrl
      }).
      when('/readPost/:id', {
        templateUrl: '/partials/readPost',
        controller: ReadPostCtrl
      }).
      when('/editPost/:id', {
        templateUrl: '/partials/editPost',
        controller: EditPostCtrl
      }).
      when('/deletePost/:id', {
        templateUrl: '/partials/deletePost',
        controller: DeletePostCtrl
      }).
      when('/login', {
        templateUrl: 'partials/login',
        controller: LoginCtrl
      }).
      when('/regist', {
        templateUrl: 'partials/regist',
        controller: RegistCtrl
      }).
      when('/logout', {
        templateUrl: 'partials/login',
        controller: LogoutCtrl
      }).
      otherwise({
        redirectTo: '/login'
      });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }]);
