(function() {
  'use strict';

  angular.
    module('app.home').
    factory('infoService', function() {
      var data = {};
      return {
        getMenu: getMenu,
        getHomeworkMenu: getHomeworkMenu,
        getClasses: getClasses
      };

      function getMenu(role) {
        var menu = [
          {
            title: '作业概览',
            sref: 'home.commonDashboard',
            icon: 'list'
          },
          {
            title: '成绩排名',
            sref: 'home.studentDetail',
            icon: 'school'
          }
        ];

        if (role !== 0) menu[1].sref = 'home.adminDetail';
        return menu;
      }

      function getHomeworkMenu(role) {
        var menu = [];
        if (role === 0) {
          menu = [
            {
              title: '作业链接',
              type: 'link',
            }
          ];
        } else if (role === 1) {
          menu = [
            {
              title: '编辑作业',
              type: 'edit'
            }
          ];
        } else {
          menu = [
            {
              title: '编辑作业',
              type: 'edit'
            }
          ];
        }
        return menu;
      }

      function getClasses(value) {
        return Array.from(
          new Array(value),
          function(v, i) { return i + 1; }
        );
      }
    });
})();
