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
      password: '',
      remember: false
    };
    vm.login = login;
    activate();

    function activate() {
      authorization.haslogin().then(function(response) {
        if (response.success) {
          changeState(response);
        }
      });
    }

    function login() {
      if (!vm.form.stuid || !vm.form.password) {
        $mdToast.show(
          $mdToast.simple().
            position('top right').
            textContent('用户名或密码未填写').
            hideDelay(1000)
        );
      } else {
        authorization.login(vm.form).then(function(response) {
          if (response.success) {
            changeState(response);
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
    }

    function changeState(response) {
      storage.set('user', response.data.user);
      storage.set('classes', response.data.classes);
      $state.go('home.commonDashboard');
    }
  }
})();
