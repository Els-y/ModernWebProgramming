(function() {
  'use strict';

  angular.
    module('app.home').
    controller('homeController', homeController);

    homeController.$inject = ['$scope', 'storage', 'authorization', '$http', '$state', '$mdSidenav', 'info'];
    function homeController($scope, storage, authorization, $http, $state, $mdSidenav, info) {
      var vm = this;
      $scope.user = storage.get('user');
      $scope.selectSection = selectSection;
      $scope.classes = info.classes;
      $scope.selectedClass = $scope.user.role === 0 ? $scope.user.class : ($scope.classes.length !== 0 ? $scope.classes[0] : null);
      vm.menu = info.menu;
      vm.openedSection = vm.menu[0];
      vm.logout = logout;
      vm.toggleSideNav = toggleSideNav;
      vm.isSectionSelected = isSectionSelected;

      function logout() {
        authorization.logout().then(function(response) {
          if (response.success) {
            storage.set('user', {});
            $state.go('login');
          }
        });
      }

      function toggleSideNav() {
        $mdSidenav('left').toggle();
      }

      function selectSection(section) {
        vm.openedSection = section;
      }

      function isSectionSelected(section) {
        return vm.openedSection.sref === section.sref;
      }
    }
})();
