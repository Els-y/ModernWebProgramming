(function() {
  'use strict';

  angular.
    module('app.core').
    factory('homeworkService', homeworkService);

    homeworkService.$inject = ['$http'];
    function homeworkService($http) {
      return {
        getOneById: getOneById,
        getAll: getAll,
        publish: publish,
        edit: edit
      };

      function getOneById(id) {
        return basic('/homework/getOneById/' + id, 'get');
      }

      function getAll() {
        return basic('/homework/getAll', 'get');
      }

      function publish(form) {
        return basic('/homework/single', 'post', form);
      }

      function edit(form) {
        return basic('/homework/single', 'put', form);
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
