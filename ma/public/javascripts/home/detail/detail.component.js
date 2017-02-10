(function() {
  'use strict';

  angular.
    module('app.home.detail').
    component('homeDetail', {
      templateUrl: '/templates/detail',
      controller: ['$http',
        function detailCtrl($http) {
          console.log('homework detail');
        }
      ]
    });
})();
