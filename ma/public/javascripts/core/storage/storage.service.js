(function() {
  'use strict';

  angular.
    module('app.core').
    factory('storage', function() {
      var data = {};
      return {
        get: get,
        set: set
      };

      function get(key) {
        return data[key];
      }

      function set(key, value) {
        data[key] = value;
      }
    });
})();
