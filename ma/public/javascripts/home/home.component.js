(function() {
  'use strict';

  angular.
    module('app.home').
    component('homePage', {
      templateUrl: '/templates/home',
      controller: ['$scope', 'storage', '$http', '$state', '$mdSidenav',
      function homePageCtrl($scope, storage, $http, $state, $mdSidenav) {
        $scope.user = storage.getUser();
        this.logout = function() {
          $http.get('/users/logout').then(function successCallback(response) {
            if (response.data.success) {
              storage.setUser({});
              $state.go('login');
            }
          });
        };
        this.toggleSideNav = function() {
          $mdSidenav('left').toggle();
        };
      }
    ]
  });
})();
