(function() {
  'use strict';

  angular.
    module('app.home.common.dashboard').
    controller('homeCommonDashboardController', homeCommonDashboardController);

  homeCommonDashboardController.$inject = ['$state', '$scope', '$filter', '$mdDialog', 'info', 'storage', 'homeworkService'];
  function homeCommonDashboardController($state, $scope, $filter, $mdDialog, info, storage, homeworkService) {
    var vm = this;
    vm.homeworkMenu = info.homeworkMenu;
    vm.homeworks = [];
    vm.openMenu = openMenu;
    vm.addHomework = addHomework;
    vm.editHomework = editHomework;
    vm.downloadHomework = downloadHomework;
    vm.reviewHomework = reviewHomework;
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
      var user = storage.get('user');
      homeworkService.download(user, homework._id);
    }

    function reviewHomework(homework) {
      var user = storage.get('user');
      var nextState = user.role === 0 ? 'home.studentReview' : 'home.adminReview';

      $scope.selectSection({
        title: '评审作业'
      });
      $state.go(nextState, {
        homework: homework
      });
    }

    function showUploadDialog(homework) {
      storage.set('uploadTarget', homework);
      $mdDialog.show({
        controller: 'uploadDialogController',
        controllerAs: 'dialog',
        templateUrl: '/templates/uploadDialog',
        clickOutsideToClose: false,
      }).then(function() {}, function() {
        reloadHomeworks();
      });
    }

    function activate() {
      var user = storage.get('user');
      info.homeworkList.then(function(response) {
        vm.homeworks = response.data.list;
        vm.homeworks.map(function(homework, index) {
          homework.isSubmitted = checkSubmitted(homework, user);
        });
        storage.set('homeworks', vm.homeworks);
      });
    }

    function reloadHomeworks() {
      var user = storage.get('user');
      homeworkService.getAll().then(function(response) {
        vm.homeworks = response.data.list;
        vm.homeworks.map(function(homework, index) {
          homework.isSubmitted = checkSubmitted(homework, user);
        });
        storage.set('homeworks', vm.homeworks);
      });
    }

    function checkSubmitted(homework, user) {
      return homework.submitted.some(function (submit) {
        return submit === user._id;
      });
    }
  }
})();
