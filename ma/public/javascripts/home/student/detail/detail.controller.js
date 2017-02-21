(function() {
  'use strict';

  angular.
    module('app.home.student.detail').
    controller('homeStudentDetailController', homeStudentDetailController);

  homeStudentDetailController.$inject = ['info', 'homeworkService', 'storage'];
  function homeStudentDetailController(info, homeworkService, storage) {
    var vm = this;
    vm.selectHomework = selectHomework;

    activate();

    function selectHomework(homework) {
      homeworkService.getRank(homework).then(function(response) {
        var score;
        var rank = 0;
        var count = 0;
        var hasself = false;
        var finish = false;
        var user = storage.get('user');

        vm.ranks = [];
        response.data.reviews.forEach(function(review) {
          if (count >= 10 && review.score !== score) finish = true;
          if (finish && hasself) return;

          if (review.score === score) {
            review.pos = rank;
          } else {
            rank = count;
            review.pos = ++rank;
            score = review.score;
          }

          if (review.to._id === user._id) {
            hasself = true;
            review.self = true;
          }

          if (!finish || hasself) vm.ranks.push(review);
          count++;
        });
        vm.scoreDistribution = homeworkService.drawPieGraph(response.data.reviews);
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
