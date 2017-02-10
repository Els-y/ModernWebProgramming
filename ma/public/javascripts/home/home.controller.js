(function() {
  'use strict';

  angular.
    module('app.home').
    controller('homeController', homeController);

    homeController.$inject = ['$scope', 'storage', 'authorization', '$http', '$state', '$mdSidenav'];
    function homeController($scope, storage, authorization, $http, $state, $mdSidenav) {
      var vm = this;
      $scope.user = storage.get('user');
      vm.logout = function() {
        authorization.logout().then(function(response) {
          if (response.success) {
            storage.set('user', {});
            $state.go('login');
          }
        });
      };
      vm.toggleSideNav = function() {
        $mdSidenav('left').toggle();
      };
    }
})();
