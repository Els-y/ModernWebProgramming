(function() {
  'use strict';

  angular.
    module('app.home.student.detail').
    controller('homeStudentDetailController', homeStudentDetailController);

  homeStudentDetailController.$inject = ['info', 'homeworkService'];
  function homeStudentDetailController(info, homeworkService) {
    var vm = this;
    vm.selectHomework = selectHomework;

    activate();

    function selectHomework(homework) {
      homeworkService.getRank(homework).then(function(response) {
        var rank = 0, count = 0, score;
        vm.ranks = [];
        response.data.reviews.forEach(function(review) {
          if (review.score === score) {
            review.pos = rank;
          } else {
            if (count < 10) {
              review.pos = ++rank;
              score = review.score;
            } else {
              return;
            }
          }
          count++;
          vm.ranks.push(review);
        });
      });
    }

    function activate() {
      info.homeworkList.then(function(response) {
        vm.homeworks = response.data.list;
        if (vm.homeworks.length !== 0) {
          selectHomework(vm.homeworks[0]);
        }
      });
    }
  }
})();
