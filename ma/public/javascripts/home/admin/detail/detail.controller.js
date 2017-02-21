(function() {
  'use strict';

  angular.
    module('app.home.admin.detail').
    controller('homeAdminDetailController', homeAdminDetailController);

  homeAdminDetailController.$inject = ['$scope', '$filter', 'info', 'homeworkService'];
  function homeAdminDetailController($scope, $filter, info, homeworkService) {
    var vm = this;
    vm.homeworks = [];
    vm.selectHomework = selectHomework;

    activate();

    function selectHomework(homework) {
      homeworkService.getRank(homework).then(function(response) {
        var score;
        var count = 0;
        var rank = 0;
        vm.ranks = [];

        response.data.reviews.forEach(function(review) {
          if (review.score === score) {
            review.pos = rank;
          } else {
            rank = count;
            review.pos = ++rank;
            score = review.score;
          }
          count++;
          vm.ranks.push(review);
        });
        vm.scoreDistribution = homeworkService.drawPieGraph(response.data.reviews);
      });
    }

    function activate() {
      info.homeworkList.then(function(response) {
        vm.homeworks = response.data.list;
        updateGraphCard($scope.selectedClass);
      });

      $scope.$watch('selectedClass', function(nv, ov) {
        updateGraphCard(nv);
      });
    }

    function updateGraphCard(selectedClass) {
      var homeworks = $filter('homeworkClassFilter')(vm.homeworks, selectedClass);
      var first = homeworks[0];

      if (first) {
        selectHomework(first);
      } else {
        vm.ranks = [];
        vm.scoreDistribution = homeworkService.drawPieGraph([]);
      }
    }
  }
})();
