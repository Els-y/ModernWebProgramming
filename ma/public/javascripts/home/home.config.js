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
            controllerAs: 'vm'
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
      });
    }
})();
