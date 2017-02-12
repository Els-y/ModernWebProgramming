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
        return basic('/users/haslogin', 'get');
      }

      function login(form) {
        return basic('/users/login', 'post', form);
      }

      function logout() {
        return basic('/users/logout', 'get');
      }

      function basic(url, methods, data) {
        return $http[methods](url, data).
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
