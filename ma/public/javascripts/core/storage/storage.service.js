(function() {
  'use strict';

  angular.
    module('app.core').
    factory('storage', function() {
      var data = {
        user: {}
      };
      var _getUser = function() {
        return data.user;
      };
      var _setUser = function(user) {
        data.user = user;
      };
      return {
        getUser: _getUser,
        setUser: _setUser
      };
    });
})();
