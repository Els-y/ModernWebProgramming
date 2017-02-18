(function() {
  'use strict';

  angular.
    module('app.home.student.review').
    controller('homeStudentReviewController', homeStudentReviewController);

  homeStudentReviewController.$inject = ['info', 'homeworkService', 'FileSaver', 'Blob', '$mdToast'];
  function homeStudentReviewController(info, homeworkService, FileSaver, Blob, $mdToast) {
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
      info.reviews.then(function(response) {
          vm.reviews = response.data.reviews;
      });

      console.log(vm.reviews);

      info.uploads.then(function(response) {
        vm.uploads = response.data.uploads;
      });
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
