(function() {
  'use strict';

  angular.
    module('core.authorization').
    service('Authorization', ['$http',
      function($http) {
        this.haslogin = function() {
          return $http.get('/users/haslogin');
        };
        this.login = function(form) {
          return $http.post('/users/login', form);
        };
      }
    ]);
})();
