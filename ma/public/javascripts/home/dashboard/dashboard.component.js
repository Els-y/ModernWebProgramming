(function() {
  'use strict';

  angular.
    module('app.home.dashboard').
    component('homeDashboard', {
      templateUrl: '/templates/dashboard',
      controller: ['$scope', '$http',
        function dashboardCtrl($scope, $http) {
          console.log('dash');
        }
      ]
    });
})();
