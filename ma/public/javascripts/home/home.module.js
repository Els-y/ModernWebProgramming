(function() {
  'use strict';

  angular.module('app.home', [
    'ui.router',
    'ngMaterial',
    'app.core',
    'app.home.student',
    'app.home.ta',
    'app.home.teacher'
  ]);
})();
