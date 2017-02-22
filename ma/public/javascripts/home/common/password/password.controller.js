(function() {
  'use strict';

  angular.
    module('app.home.common.password').
    controller('homeCommonPasswordController', homeCommonPasswordController);

  homeCommonPasswordController.$inject = ['authorization', '$mdToast'];
  function homeCommonPasswordController(authorization, $mdToast) {
    var vm = this;
    vm.form = {};
    vm.submit = submit;

    function submit() {
      if (!vm.form.old ||
          !vm.form.new ||
          !vm.form.confirm) {
        toast('密码填写不完整');
        return;
      } else if (vm.form.new !== vm.form.confirm) {
        toast('两次新密码输入不一致');
        return;
      }

      authorization.changePassword(vm.form).
        then(function(response) {
          if (response.success) {
            toast('修改成功');
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
          hideDelay(2000)
      );
    }
  }
})();
