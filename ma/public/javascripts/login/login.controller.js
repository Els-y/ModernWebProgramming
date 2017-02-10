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
        if (response.logined) {
          storage.set('user', response.user);
          $state.go('home.dashboard');
        }
      });
    }

    function login() {
      authorization.login(vm.form).then(function(response) {
        if (response.success) {
          storage.set('user', response.data.user);
          $state.go('home.dashboard');
        } else {
          $mdToast.show(
            $mdToast.simple().
              position('top right').
              textContent(response.data.info).
              hideDelay(1000)
          );
        }
      });
    }
  }
})();
