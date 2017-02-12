(function() {
  'use strict';

  angular.
    module('app.home.common.dashboard').
    filter('homeworkClassFilter', function homeworkClassFilter() {
      return function(list, selectedClass) {
        return list.filter(function(ele, i) {
          return ele.class === selectedClass;
        });
      };
    });
})();
