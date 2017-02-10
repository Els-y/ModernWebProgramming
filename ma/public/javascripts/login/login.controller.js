(function() {
  'use strict';

  angular.
    module('app.login').
    controller('loginController', loginController);

  loginController.$inject = ['storage', 'authorization', '$state', '$http', '$mdToast'];
  function loginController(storage, authorization, $state, $http, $mdToast) {
    var vm = this;
    vm.form = {
      stuid: '',
      password: ''
    };
    vm.login = login;
    activate();

    function activate() {
      authorization.haslogin().then(function(response) {
        if (response.success) {
          storage.set('user', response.data.user);
          addMenu(response.data.user.role);
          if (response.data.user.role === 0) {
            $state.go('home.studentDashboard');
          } else if (response.data.user.role === 1) {
            $state.go('home.taDashboard');
          } else {
            $state.go('home.teacherDashboard');
          }
        }
      });
    }

    function login() {
      authorization.login(vm.form).then(function(response) {
        if (response.success) {
          storage.set('user', response.data.user);
          addMenu(response.data.user.role);
          if (response.data.user.role === 0) {
            $state.go('home.studentDashboard');
          } else if (response.data.user.role === 1) {
            $state.go('home.taDashboard');
          } else {
            $state.go('home.teacherDashboard');
          }
        } else {
          $mdToast.show(
            $mdToast.simple().
              position('top right').
              textContent(response.data.err).
              hideDelay(1000)
          );
        }
      });
    }

    function addMenu(role) {
      var menu = [];
      if (role === 0) {
        menu = [
          {
            title: '作业概览',
            sref: 'home.studentDashboard',
            icon: 'list'
          },
          {
            title: '作业详情',
            sref: 'home.studentDetail',
            icon: 'edit'
          }
        ];
      } else if (role === 1) {
        menu = [
          {
            title: '作业概览',
            sref: 'home.taDashboard',
            icon: 'list'
          },
          {
            title: '作业详情',
            sref: 'home.taDetail',
            icon: 'edit'
          }
        ];
      } else {
        menu = [
          {
            title: '作业概览',
            sref: 'home.teacherDashboard',
            icon: 'list'
          },
          {
            title: '作业详情',
            sref: 'home.teacherDetail',
            icon: 'edit'
          }
        ];
      }
      storage.set('menu', menu);
    }
  }
})();
