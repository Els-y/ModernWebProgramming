(function() {
  'use strict';

  angular.
    module('app.home.student.review').
    controller('homeStudentReviewController', homeStudentReviewController);

  homeStudentReviewController.$inject = ['info', 'homeworkService', 'FileSaver', 'Blob', '$mdToast', '$stateParams'];
  function homeStudentReviewController(info, homeworkService, FileSaver, Blob, $mdToast, $stateParams) {
    var vm = this;
    vm.currentNavItem = 'mine';
    vm.uploads = [];
    vm.downloadUpload = downloadUpload;
    vm.submit = submit;

    function downloadUpload(upload) {
      homeworkService.download(upload.author, upload.homework);
    }

    function submit(upload) {
      if (!upload.review ||
          !upload.review.content ||
          !upload.review.score) {
        toast('评论或分数未填写');
        return;
      } else if (!checkScore(upload.review.score)) {
        toast('分数必须为0~100整数');
        return;
      }

      homeworkService.submitReview({
        homework: upload.homework,
        to: upload.author._id,
        content: upload.review.content,
        score: upload.review.score
      }).then(function(response) {
        if (response.success) {
          toast('评论提交成功');
        } else {
          toast('评论提交失败');
        }
      });
    }

    activate();
    function activate() {
      var timenow = new Date();
      var endTime = new Date($stateParams.homework.endTime);

      info.reviews.then(function(response) {
        vm.reviews = response.data.reviews;
      });

      info.uploads.then(function(response) {
        vm.uploads = response.data.uploads;
      });

      if (timenow <= endTime) {
        vm.otherReview = true;
      } else {
        vm.otherReview = false;
      }
    }

    function checkScore(score) {
      var value = Number(score);
      return !isNaN(value) &&
        value >= 0 &&
        value <= 100 &&
        value % 1 === 0;
    }

    function toast(text) {
      $mdToast.show(
        $mdToast.simple().
          position('top right').
          textContent(text).
          hideDelay(2000)
      );
    }
  }
})();
