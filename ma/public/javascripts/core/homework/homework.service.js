(function() {
  'use strict';

  angular.
    module('app.core').
    factory('homeworkService', homeworkService);

    homeworkService.$inject = ['$http', '$filter', 'storage', 'FileSaver', 'Blob', '$mdToast'];
    function homeworkService($http, $filter, storage, FileSaver, Blob, $mdToast) {
      return {
        getOneById: getOneById,
        getAll: getAll,
        publish: publish,
        edit: edit,
        download: download,
        uploadGithub: uploadGithub,
        getIndex: getIndex,
        getToReview: getToReview,
        getFromReview: getFromReview,
        submitReview: submitReview,
        confirmReview: confirmReview,
        getRank: getRank
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

      function download(author, homeworkId) {
        var fileName = '' + author.class + '班-' + author.group + '组-' + author.name + '-' + new Date().getTime() + '.zip';

        return $http.get('/upload/download', {
          params: {
            author: author._id,
            homework: homeworkId
          },
          responseType: 'arraybuffer'
        }).then(function(response) {
          if (response.headers()['content-length'] !== '0') {
            var data = new Blob([response.data]);
            FileSaver.saveAs(data, fileName);
          } else {
            $mdToast.show(
              $mdToast.simple().
                position('top right').
                textContent('暂未提交代码包').
                hideDelay(2000)
            );
          }
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
      }

      function getIndex(homework) {
        var homeworks = storage.get('homeworks');
        var user = storage.get('user');
        var classHomeworks = $filter('homeworkClassFilter')(homeworks, user.class);
        return classHomeworks.findIndex(function(ele) {
          return ele._id === homework._id;
        }) + 1;
      }

      function getToReview(homework) {
        return basic('/review/to', 'get', {
          params: {
            homework: homework._id
          }
        });
      }

      function getFromReview(homework) {
        return basic('/review/from', 'get', {
          params: {
            homework: homework._id
          }
        });
      }

      function submitReview(form) {
        return basic('/review/to', 'post', form);
      }

      function confirmReview(form) {
        return basic('/review/confirm', 'post', form);
      }

      function getRank(homework) {
        return basic('/review/rank', 'get', {
          params: {
            homework: homework._id
          }
        });
      }
    }
})();
