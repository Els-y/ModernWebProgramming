(function() {
  'use strict';

  angular.
    module('app.home.teacher.dashboard').
    controller('homeTeacherDashboardController', homeTeacherDashboardController);

  homeTeacherDashboardController.$inject = ['info', '$state', '$scope'];
  function homeTeacherDashboardController(info, $state, $scope) {
    var vm = this;
    vm.homeworkMenu = info.homeworkMenu;
    vm.homeworks = [];
    vm.openMenu = openMenu;
    vm.deleteHomework = deleteHomework;
    vm.editHomework = editHomework;
    
    activate();

    function openMenu($mdMenu, ev) {
      $mdMenu.open(ev);
    }

    function deleteHomework(homework) {
      console.log(homework);
    }

    function editHomework(homework) {
      $scope.selectSection({
        title: '编辑作业'
      });
      $state.go('home.teacherEdit', {
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
