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
        var menu = [];
        if (role === 0) {
          menu = [
            {
              title: '作业概览',
              sref: 'home.commonDashboard',
              icon: 'list'
            },
            {
              title: '作业详情',
              sref: 'home.studentDetail',
              icon: 'edit'
            }
          ];
        } else if (role === 1) {
          menu = [
            {
              title: '作业概览',
              sref: 'home.commonDashboard',
              icon: 'list'
            }
          ];
        } else {
          menu = [
            {
              title: '作业概览',
              sref: 'home.commonDashboard',
              icon: 'list'
            }
          ];
        }
        return menu;
      }

      function getHomeworkMenu(role) {
        var menu = [];
        if (role === 0) {
          menu = [
            {
              title: '作业链接',
              type: 'link',
            },
            // {
            //   title: '作业成绩',
            //   type: 'score',
            // },

          ];
        } else if (role === 1) {
          menu = [
            {
              title: '编辑作业',
              type: 'edit'
            },
            // {
            //   title: '作业成绩',
            //   type: 'state',
            //   state: {
            //     title: '作业成绩',
            //     sref: 'home.adminScore'
            //   },
            // },

          ];
        } else {
          menu = [
            {
              title: '编辑作业',
              type: 'edit'
            },
            // {
            //   title: '作业成绩',
            //   type: 'state',
            //   state: {
            //     title: '作业成绩',
            //     sref: 'home.adminScore'
            //   },
            // },

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
