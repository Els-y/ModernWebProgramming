(function() {
  'use strict';

  angular.
    module('app.home.common.dashboard').
    controller('homeCommonDashboardController', homeCommonDashboardController);

  homeCommonDashboardController.$inject = ['info', '$state', '$scope', 'storage'];
  function homeCommonDashboardController(info, $state, $scope, storage) {
    var vm = this;
    vm.homeworkMenu = info.homeworkMenu;
    vm.homeworks = [];
    vm.openMenu = openMenu;
    vm.addHomework = addHomework;
    vm.editHomework = editHomework;

    activate();

    function openMenu($mdMenu, ev) {
      $mdMenu.open(ev);
    }

    function addHomework() {
      if ($scope.user.role === 0) return;
      $scope.selectSection({
        title: '发布作业'
      });
      $state.go('home.adminEdit');
    }

    function editHomework(homework) {
      $scope.selectSection({
        title: '编辑作业'
      });
      $state.go('home.adminEdit', {
        homework: homework
      });
    }

    function activate() {
      info.homeworkList.then(function(response) {
        vm.homeworks = response.data.list;
      });
    }
  }
})();
