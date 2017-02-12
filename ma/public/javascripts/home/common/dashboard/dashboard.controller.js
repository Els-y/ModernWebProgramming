(function() {
  'use strict';

  angular.
    module('app.home.common.dashboard').
    controller('homeCommonDashboardController', homeCommonDashboardController);

  homeCommonDashboardController.$inject = ['info', '$state', '$scope', 'storage', '$mdDialog'];
  function homeCommonDashboardController(info, $state, $scope, storage, $mdDialog) {
    var vm = this;
    vm.homeworkMenu = info.homeworkMenu;
    vm.homeworks = [];
    vm.openMenu = openMenu;
    vm.addHomework = addHomework;
    vm.editHomework = editHomework;
    vm.showUploadDialog = showUploadDialog;
    // vm.uploadHomework = uploadHomework;

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

    function showUploadDialog(homework) {
      storage.set('uploadTarget', homework);
      $mdDialog.show({
        controller: 'uploadDialogController',
        controllerAs: 'dialog',
        templateUrl: '/templates/uploadDialog',
        // parent: angular.element(document.body),
        // targetEvent: ev,
        clickOutsideToClose: true,
      }).then(function(answer) {
        console.log('You said the information was "' + answer + '".');
      }, function() {
        // 关闭窗口时触发
        console.log('close dialog');
      });
    }

    function activate() {
      info.homeworkList.then(function(response) {
        vm.homeworks = response.data.list;
      });
    }
  }
})();
