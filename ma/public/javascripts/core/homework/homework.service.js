(function() {
  'use strict';

  angular.
    module('app.core').
    factory('homeworkService', homeworkService);

    homeworkService.$inject = ['$http', '$filter', 'storage'];
    function homeworkService($http, $filter, storage) {
      return {
        getOneById: getOneById,
        getAll: getAll,
        publish: publish,
        edit: edit,
        download: download,
        uploadGithub: uploadGithub,
        getIndex: getIndex,
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

      function download(params) {
        return basic('/upload/download', 'get', {
           params: params,
           responseType: 'arraybuffer'
         });
      }

      function uploadGithub(form) {
        return basic('/upload/github', 'post', form);
      }

      function basic(url, methods, data) {
        return $http[methods](url, data).
                 then(successCallback);

        function successCallback(response) {
          return response.data;
        }

        function errorCallback(response) {
          console.log('error happened');
        }
      }

      function getIndex(homework) {
        var homeworks = storage.get('homeworks');
        var user = storage.get('user');
        var classHomeworks = $filter('homeworkClassFilter')(homeworks, user.class);
        return classHomeworks.findIndex(function(ele) {
          return ele._id === homework._id;
        }) + 1;
      }
    }
})();
