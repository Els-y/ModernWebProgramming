(function() {
  'use strict';

  angular.
    module('app.login').
    component('loginPage', {
      templateUrl: '/templates/login',
      controller: ['storage', '$state', '$http', '$mdToast',
        function loginPageCtrl(storage, $state, $http, $mdToast) {
          $http.get('/users/haslogin').then(function successCallback(response) {
            if (response.data.logined) {
              storage.setUser(response.data.user);
              $state.go('home.dashboard');
            }
          });

          var self = this;
          self.form = {
            stuid: '',
            password: ''
          };
          self.login = function() {
            $http.post('/users/login', self.form).then(function successCallback(response) {
              if (response.data.success) {
                storage.setUser(response.data.data.user);
                $state.go('home.dashboard');
              } else {
                $mdToast.show(
                  $mdToast.simple()
                    .position('top right')
                    .textContent(response.data.data.info)
                    .hideDelay(1000)
                );
              }
            });
          };
        }
      ]
    });
})();
