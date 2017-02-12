(function() {
  'use strict';

  angular.module('app.home', [
    'ui.router',
    'ngMaterial',
    'app.core',
    'app.home.admin',
    'app.home.student',
    'app.home.common'
  ]);
})();
