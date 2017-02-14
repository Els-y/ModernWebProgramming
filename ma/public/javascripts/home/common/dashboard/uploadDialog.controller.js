(function() {
  'use strict';

  angular.
    module('app.home.common.dashboard').
    controller('uploadDialogController', uploadDialogController);

  uploadDialogController.$inject = ['storage', 'homeworkService', '$mdDialog', '$mdToast', 'FileUploader'];
  function uploadDialogController(storage, homeworkService, $mdDialog, $mdToast, FileUploader) {
    var vm = this;
    var homework = storage.get('uploadTarget');
    vm.type = 'code';
    vm.shiftTitle = 'github';
    vm.shiftType = shiftType;
    vm.submit = submit;
    vm.cancel = cancel;
    // code
    vm.codeUploader = new FileUploader({
        url: '/upload/code',
        alias: 'code',
        queueLimit: 1,
        removeAfterUpload: true,
        formData: [{
          _id: homework._id,
          index: homeworkService.getIndex(homework)
        }]
    });

    vm.codeUploader.onSuccessItem = function(item, response, status, headers) {
      angular.element(document.querySelector('#code-file')).val('');
      vm.codeStatus = true;
      if (vm.codeStatus && vm.imgStatus) toast('上传成功');
    };

    vm.codeUploader.onBeforeUploadItem = function(item) {
      var format = item.file.name.split('.').pop();
      if (format !== 'zip') {
        toast('代码包格式必须为zip');
        vm.codeUploader.cancelAll();
      }
    };

    vm.codeUploader.onErrorItem = function(item, response, status, headers) {
      toast('代码包上传失败');
    };

    vm.codeClear = function() {
      vm.codeStatus = false;
      vm.codeUploader.clearQueue();
      angular.element(document.querySelector('#code-file')).val('');
    };

    // img
    vm.imgUploader = new FileUploader({
        url: '/upload/img',
        alias: 'img',
        queueLimit: 1,
        removeAfterUpload: true,
        formData: [{
          _id: homework._id,
          index: homeworkService.getIndex(homework)
        }]
    });

    vm.imgUploader.onSuccessItem = function(item, response, status, headers) {
      angular.element(document.querySelector('#img-file')).val('');
      vm.imgStatus = true;
      if (vm.codeStatus && vm.imgStatus) toast('上传成功');
    };

    vm.imgUploader.onBeforeUploadItem = function(item) {
      var format = item.file.name.split('.').pop();
      if (format !== 'png') {
        toast('预览图格式必须为png');
        vm.imgUploader.cancelAll();
      }
    };

    vm.imgUploader.onErrorItem = function(item, response, status, headers) {
      toast('预览图上传失败');
    };

    vm.imgClear = function() {
      vm.imgStatus = false;
      vm.imgUploader.clearQueue();
      angular.element(document.querySelector('#img-file')).val('');
    };

    function cancel() {
      $mdDialog.cancel();
    }

    function submit() {
      if (vm.type === 'code') {
        if (checkValid()) {
          vm.codeUploader.uploadAll();
          vm.imgUploader.uploadAll();
        } else {
          toast('作业提交不完整');
        }
      } else {
        if (vm.github) {
          homeworkService.uploadGithub({
            _id: homework._id,
            github: vm.github
          }).then(function (response) {
            if (response.success) {
              vm.githubStatus = true;
              toast('上传成功');
            } else {
              vm.githubStatus = false;
              toast('上传失败');
            }
          }).catch(function() {
            toast('上传失败');
          });
        } else {
          toast('Github 地址未填写');
        }
      }
    }

    function checkValid() {
      if (vm.codeUploader.queue.length === 0 ||
          vm.imgUploader.queue.length === 0) return false;
      else return true;
    }

    function shiftType() {
      vm.codeStatus = vm.imgStatus = vm.githubStatus = false;
      if (vm.type === 'code') {
        vm.type = 'github';
        vm.shiftTitle = '代码包';
      } else {
        vm.type = 'code';
        vm.shiftTitle = 'github';
      }
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
