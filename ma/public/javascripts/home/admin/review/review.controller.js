(function() {
  'use strict';

  angular.
    module('app.home.admin.review').
    controller('homeAdminReviewController', homeAdminReviewController);

  homeAdminReviewController.$inject = ['info', 'storage', 'homeworkService', '$mdToast', '$stateParams', '$scope'];
  function homeAdminReviewController(info, storage, homeworkService, $mdToast, $stateParams) {
    var vm = this;
    vm.uploads = [];
    vm.downloadUpload = downloadUpload;
    vm.submit = submit;
    vm.confirm = confirm;

    activate();

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

    function confirm() {
      if (!vm.signature) {
        toast('请先签名再确认');
        return;
      } else if (vm.signature !== storage.get('user').name) {
        toast('您的签名和当前账户不符');
        return;
      }

      homeworkService.confirmReview({
        homework: $stateParams.homework._id,
        signature: vm.signature
      }).then(function(response) {
        if (response.success) {
          toast('确认成功');
        } else {
          toast('确认失败');
        }
      });
    }

    function activate() {
      info.uploads.then(function(response) {
        vm.uploads = response.data.uploads;
        vm.status = response.data.status;
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

    function checkScore(score) {
      var value = Number(score);
      return !isNaN(value) &&
        value >= 0 &&
        value <= 100 &&
        value % 1 === 0;
    }
  }
})();
