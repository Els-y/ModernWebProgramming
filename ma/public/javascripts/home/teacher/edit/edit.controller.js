(function() {
  'use strict';

  angular.
    module('app.home.teacher.edit').
    controller('homeTeacherEditController', homeTeacherEditController);

  homeTeacherEditController.$inject = ['info', 'homeworkService', '$state', '$scope', '$mdToast'];
  function homeTeacherEditController(info, homeworkService, $state, $scope, $mdToast) {
    var vm = this;
    vm.form = {};
    vm.publish = publish;
    vm.edit = edit;
    vm.hours = Array.from(
      new Array(24),
      function(v, i) { return i; }
    );
    vm.minutes = Array.from(
      new Array(60),
      function(v, i) { return i; }
    );

    activate();

    function activate() {
      if (!info.homework) return;
      info.homework.then(function(response) {
        updateEditForm(response.data.homework);
      });
    }

    function publish() {
      if (!checkComplete()) {
        toast('作业信息未填写完整');
      } else if (!checkValid()) {
        toast('时间逻辑出错');
      } else {
        homeworkHandler('publish');
      }
    }

    function edit() {
      if (!checkComplete()) {
        toast('作业信息未填写完整');
      } else if (!checkValid()) {
        toast('时间逻辑出错');
      } else {
        homeworkHandler('edit');
      }
    }

    function checkComplete() {
      if (!vm.form.class ||
          !vm.form.title ||
          !vm.form.url ||
          !vm.form.begin ||
          !vm.form.begin.date ||
          vm.form.begin.hour === undefined ||
          vm.form.begin.minute === undefined ||
          !vm.form.review ||
          !vm.form.review.date ||
          vm.form.review.hour === undefined ||
          vm.form.review.minute === undefined ||
          !vm.form.end ||
          !vm.form.end.date ||
          vm.form.end.hour === undefined ||
          vm.form.end.minute === undefined) {
            return false;
          } else {
            return true;
          }
    }

    function checkValid() {
      var begin = getDate(vm.form.begin);
      var review = getDate(vm.form.review);
      var end = getDate(vm.form.end);
      if (begin > review || begin > end || review > end) {
        return false;
      } else {
        return true;
      }
    }

    function getDate(time) {
      return new Date(
        time.date.getFullYear(),
        time.date.getMonth(),
        time.date.getDate(),
        time.hour,
        time.minute
      );
    }

    function homeworkHandler(methods) {
      vm.form.begin = getDate(vm.form.begin).toISOString();
      vm.form.review = getDate(vm.form.review).toISOString();
      vm.form.end = getDate(vm.form.end).toISOString();
      homeworkService[methods](vm.form).
        then(function(response) {
          if (response.success) {
            $scope.selectSection({
              title: '作业概览',
              sref: 'home.teacherDashboard'
            });
            $state.go('home.teacherDashboard');
          } else {
            toast(response.data.err);
          }
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

    function updateEditForm(homework) {
      var beginTime = new Date(homework.beginTime);
      var reviewTime = new Date(homework.reviewTime);
      var endTime = new Date(homework.endTime);
      vm.form.title = homework.title;
      vm.form.class = homework.class;
      vm.form.url = homework.url;
      vm.form.begin = {};
      vm.form.begin.date = new Date(beginTime.getFullYear(), beginTime.getMonth(), beginTime.getDate());
      vm.form.begin.hour = beginTime.getHours();
      vm.form.begin.minute = beginTime.getMinutes();
      vm.form.review = {};
      vm.form.review.date = new Date(reviewTime.getFullYear(), reviewTime.getMonth(), reviewTime.getDate());
      vm.form.review.hour = reviewTime.getHours();
      vm.form.review.minute = reviewTime.getMinutes();
      vm.form.end = {};
      vm.form.end.date = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());
      vm.form.end.hour = endTime.getHours();
      vm.form.end.minute = endTime.getMinutes();

      vm.form._id = homework._id;
    }
  }
})();
