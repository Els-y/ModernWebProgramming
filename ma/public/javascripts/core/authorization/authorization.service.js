(function() {
  'use strict';

  angular.
    module('app.core').
    factory('authorization', authorization);

    authorization.$inject = ['$http'];
    function authorization($http) {
      return {
        haslogin: haslogin,
        login: login,
        logout: logout
      };

      function haslogin() {
        return $http.get('/users/haslogin').
                 then(successCallback, errorCallback);

        function successCallback(response) {
          return response.data;
        }

        function errorCallback(response) {
          console.log('error happened');
        }
      }

      function login(form) {
        return $http.post('/users/login', form).
                 then(successCallback, errorCallback);

        function successCallback(response) {
          return response.data;
        }

        function errorCallback(response) {
          console.log('error happened');
        }
      }

      function logout() {
        return $http.get('/users/logout').
                 then(successCallback, errorCallback);

        function successCallback(response) {
          return response.data;
        }

        function errorCallback(response) {
          console.log('error happened');
        }
      }
    }
})();
