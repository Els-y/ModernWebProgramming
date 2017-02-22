(function() {
  'use strict';

  angular.
    module('app.home.common.dashboard').
    controller('homeCommonDashboardController', homeCommonDashboardController);

  homeCommonDashboardController.$inject = ['$state', '$scope', '$interval', '$mdDialog', 'info', 'storage', 'homeworkService'];
  function homeCommonDashboardController($state, $scope, $interval, $mdDialog, info, storage, homeworkService) {
    var vm = this;
    var timer;
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
        addHomeworkStatus(vm.homeworks, user);
        storage.set('homeworks', vm.homeworks);
      });

      timer = $interval(reloadHomeworks, 4000);
      $scope.$on('$destroy', function(){
        $interval.cancel(timer);
      });
    }

    function reloadHomeworks() {
      var user = storage.get('user');
      homeworkService.getAll().then(function(response) {
        vm.homeworks = response.data.list;
        addHomeworkStatus(vm.homeworks, user);
        storage.set('homeworks', vm.homeworks);
      });
    }

    function checkSubmitted(homework, user) {
      return homework.submitted.some(function (submit) {
        return submit === user._id;
      });
    }

    function addHomeworkStatus(homeworks, user) {
      var timenow = new Date();
      var beginTime, reviewTime, endTime;

      homeworks.map(function(homework, index) {
        homework.isSubmitted = checkSubmitted(homework, user);
        homework.menu = info.homeworkMenu.slice();
        homework.showdate = true;

        beginTime = new Date(homework.beginTime);
        reviewTime = new Date(homework.reviewTime);
        endTime = new Date(homework.endTime);

        if (user.role === 0) {
          if (timenow < beginTime) {
            homework.statusbar = '未开始';
          } else if (timenow >= beginTime && timenow <= endTime) {
            homework.statusbar = '开始提交';
          } else if (timenow > endTime) {
            homework.statusbar = '已结束';
            homework.showdate = false;
          }

          if (timenow >= beginTime && timenow <= endTime) {
            homework.menu.push({
              title: '提交作业',
              type: 'upload'
            });
          }
          if (timenow >= reviewTime) {
            homework.menu.push({
              title: '评审作业',
              type: 'review'
            });
          }
          if (homework.isSubmitted) {
            homework.menu.push({
              title: '下载提交',
              type: 'download',
            });
          }
        } else if (user.role === 1) {
          if (timenow < beginTime) {
            homework.statusbar = '未开始';
          } else if (timenow >= beginTime && timenow <= endTime) {
            homework.statusbar = '等待提交及互评';
          } else if (timenow > endTime && homework.status === 0) {
            homework.statusbar = '未评审';
          } else if (homework.status === 1) {
            homework.statusbar = '等待教师评审';
          } else {
            homework.statusbar = '已结束';
            homework.showdate = false;
          }

          if (timenow > endTime) {
            homework.menu.push({
              title: '评审作业',
              type: 'review'
            });
          }
        } else {
          if (timenow < beginTime) {
            homework.statusbar = '未开始';
          } else if (timenow >= beginTime && timenow <= endTime) {
            homework.statusbar = '等待提交及互评';
          } else if (timenow > endTime && homework.status === 0) {
            homework.statusbar = '等待TA评审';
          } else if (homework.status === 1) {
            homework.statusbar = '未评审';
          } else {
            homework.statusbar = '已结束';
            homework.showdate = false;
          }

          if (homework.status === 1 || homework.status === 2) {
            homework.menu.push({
              title: '评审作业',
              type: 'review'
            });
          }
        }
      });
    }
  }
})();
