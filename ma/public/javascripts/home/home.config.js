(function() {
  'use strict';

  angular.
    module('app.home').
    config(appHomeStateConfig);

  appHomeStateConfig.$inject = ['$stateProvider'];
  function appHomeStateConfig($stateProvider) {
    $stateProvider.
      // Common
      state('home.commonDashboard', {
        url: '/common/dashboard',
        views: {
          'content': {
            templateUrl: '/templates/commonDashboard',
            controller: 'homeCommonDashboardController',
            controllerAs: 'vm',
            resolve: {
              info: ['storage', 'infoService', 'homeworkService',
              function(storage, infoService, homeworkService) {
                var role = storage.get('user').role;
                return {
                  homeworkMenu: infoService.getHomeworkMenu(role),
                  homeworkList: homeworkService.getAll()
                };
              }]
            }
          }
        }
      }).
      // Student
      state('home.studentDetail', {
        url: '/student/detail',
        views: {
          'content': {
            templateUrl: '/templates/studentDetail',
            controller: 'homeStudentDetailController',
            controllerAs: 'vm'
          }
        }
      }).
      // Admin
      state('home.adminEdit', {
        url: '/admin/edit/',
        params: {
          homework: null
        },
        views: {
          'content': {
            templateUrl: '/templates/adminEdit',
            controller: 'homeAdminEditController',
            controllerAs: 'vm',
            resolve: {
              info: ['$stateParams', 'homeworkService', function($stateParams, homeworkService) {
                var object = {
                  homework: null
                };
                if ($stateParams.homework) {
                    object.homework = homeworkService.getOneById($stateParams.homework._id);
                }
                return object;
              }]
            }
          }
        }
      });
    }
})();