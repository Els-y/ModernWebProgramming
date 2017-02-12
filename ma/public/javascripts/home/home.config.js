(function() {
  'use strict';

  angular.
    module('app.home').
    config(appHomeStateConfig);

  appHomeStateConfig.$inject = ['$stateProvider'];
  function appHomeStateConfig($stateProvider) {
    $stateProvider.
      // Student
      state('home.studentDashboard', {
        url: '/student/dashboard',
        views: {
          'content': {
            templateUrl: '/templates/studentDashboard',
            controller: 'homeStudentDashboardController',
            controllerAs: 'vm'
          }
        }
      }).
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
      // Ta
      state('home.taDashboard', {
        url: '/ta/dashboard',
        views: {
          'content': {
            templateUrl: '/templates/taDashboard',
            controller: 'homeTaDashboardController',
            controllerAs: 'vm'
          }
        }
      }).
      state('home.taDetail', {
        url: '/ta/detail',
        views: {
          'content': {
            templateUrl: '/templates/taDetail',
            controller: 'homeTaDetailController',
            controllerAs: 'vm'
          }
        }
      }).
      // Teacher
      state('home.teacherDashboard', {
        url: '/teacher/dashboard',
        views: {
          'content': {
            templateUrl: '/templates/teacherDashboard',
            controller: 'homeTeacherDashboardController',
            controllerAs: 'vm',
            resolve: {
              info: function(storage, infoService, homeworkService) {
                var role = storage.get('user').role;
                return {
                  homeworkMenu: infoService.getHomeworkMenu(role),
                  homeworkList: homeworkService.getAll()
                };
              }
            }
          }
        }
      }).
      state('home.teacherDetail', {
        url: '/teacher/detail',
        views: {
          'content': {
            templateUrl: '/templates/teacherDetail',
            controller: 'homeTeacherDetailController',
            controllerAs: 'vm'
          }
        }
      }).
      state('home.teacherEdit', {
        url: '/teacher/edit/',
        params: {
          homework: null
        },
        views: {
          'content': {
            templateUrl: '/templates/teacherEdit',
            controller: 'homeTeacherEditController',
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
