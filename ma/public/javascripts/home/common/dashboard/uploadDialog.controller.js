(function() {
  'use strict';

  angular.
    module('app.home.common.dashboard').
    controller('uploadDialogController', uploadDialogController);

  uploadDialogController.$inject = ['storage', '$mdDialog', 'FileUploader'];
  function uploadDialogController(storage, $mdDialog, FileUploader) {
    var vm = this;
    var homework = storage.get('uploadTarget');
    vm.code = new FileUploader({
        url: '/upload',
        alias: 'code',
        queueLimit: 1,     //文件个数
        removeAfterUpload: true   //上传后删除文件
    });
    vm.code.onSuccessItem = function() {
      console.log('upload success');
    };
    vm.clear = function() {
      vm.code.cancelAll();
    };
    vm.cancel = function() {
      $mdDialog.cancel();
    };
    vm.upload = upload;
    function upload() {
      console.log('start upload');
      vm.code.uploadAll();
    }

  }
})();
