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
            controllerAs: 'vm',
            resolve: {
              info: function(storage, infoService) {
                var role = storage.get('user').role;
                var classes = storage.get('classes');
                return {
                  menu: infoService.getMenu(role),
                  classes: infoService.getClasses(classes)
                };
              }
            }
          }
        }
      });
  }
})();
