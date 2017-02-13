(function() {
  'use strict';

  angular.
    module('app.home.common.dashboard').
    controller('homeCommonDashboardController', homeCommonDashboardController);

  homeCommonDashboardController.$inject = ['$state', '$scope', '$filter', '$mdDialog', '$mdToast', 'info', 'storage', 'homeworkService', 'FileSaver', 'Blob'];
  function homeCommonDashboardController($state, $scope, $filter, $mdDialog, $mdToast, info, storage, homeworkService, FileSaver, Blob) {
    var vm = this;
    vm.homeworkMenu = info.homeworkMenu;
    vm.homeworks = [];
    vm.openMenu = openMenu;
    vm.addHomework = addHomework;
    vm.editHomework = editHomework;
    vm.downloadHomework = downloadHomework;
    vm.showUploadDialog = showUploadDialog;

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

    function downloadHomework(homework) {
      var target = homeworkService.getIndex(homework);
      var user = storage.get('user');
      var fileName = '作业' + target + '-' + user.class + '班-' + user.group + '组-' + user.name + '-' + new Date().getTime() + '.zip';

      homeworkService.download({
        _id: homework._id,
      }).then(function(response) {
        var data = new Blob([response]);
        FileSaver.saveAs(data, fileName);
      }).catch(function() {
        toast('暂未提交作业');
      });
    }

    function showUploadDialog(homework) {
      storage.set('uploadTarget', homework);
      $mdDialog.show({
        controller: 'uploadDialogController',
        controllerAs: 'dialog',
        templateUrl: '/templates/uploadDialog',
        clickOutsideToClose: false,
      }).then(function(answer) {
        console.log('You said the information was "' + answer + '".');
      }, function() {
        // 关闭窗口时触发
        console.log('close dialog');
      });
    }

    function toast(text) {
      $mdToast.show(
        $mdToast.simple().
          position('top right').
          textContent(text).
          hideDelay(1000)
      );
    }

    function activate() {
      info.homeworkList.then(function(response) {
        vm.homeworks = response.data.list;
        storage.set('homeworks', vm.homeworks);
      });
    }
  }
})();
