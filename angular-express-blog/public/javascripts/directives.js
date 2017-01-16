'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('usernameValidator', [function () {
    return {
      require: "ngModel",
      link: function (scope, element, attr, ngModel) {
        if (!ngModel) return;
        var reg_alp = /^[a-zA-Z]/;
        var reg = /^[a-zA-Z][0-9a-zA-Z_]{5,17}$/;

        var alpha, valid;

        var usernameValidator = function (value) {
          alpha = reg_alp.test(value);
          valid = reg.test(value);
          ngModel.$setValidity("startWithLetter", alpha);
          ngModel.$setValidity("valid", valid);
          return (alpha && valid) ? value : undefined;
        };
        ngModel.$parsers.push(usernameValidator);
      }
    };
  }]).
  directive('passwordValidator', [function () {
    return {
      require: "ngModel",
      link: function (scope, element, attr, ngModel) {
        if (!ngModel) return;
        var reg = /^[0-9a-zA-Z\-_]{6,12}$/;
        var valid;

        var passwordValidator = function (value) {
          valid = reg.test(value);
          ngModel.$setValidity("valid", valid);
          return valid ? value : undefined;
        };
        ngModel.$parsers.push(passwordValidator);
      }
    };
  }]).
  directive('stuidValidator', [function () {
    return {
      require: "ngModel",
      link: function (scope, element, attr, ngModel) {
        if (!ngModel) return;
        var reg_start = /^[1-9]/;
        var reg_number = /[^\d]/;
        var valid, number;

        var stuidValidator = function (value) {
          valid = reg_start.test(value);
          number = !reg_number.test(value);
          ngModel.$setValidity("startWithZero", valid);
          ngModel.$setValidity("hasLetter", number);
          return (valid && number) ? value : undefined;
        };
        ngModel.$parsers.push(stuidValidator);
      }
    };
  }]).
  directive('emailValidator', [function () {
    return {
      require: "ngModel",
      link: function (scope, element, attr, ngModel) {
        if (!ngModel) return;
        var reg = /^\w+([-+.]\w+)*@(([0-9a-zA-Z_\-]+\.)+[a-zA-Z]{2,4})$/;
        var valid;

        var emailValidator = function (value) {
          valid = reg.test(value);
          ngModel.$setValidity("valid", valid);
          return valid ? value : undefined;
        };
        ngModel.$parsers.push(emailValidator);
      }
    };
  }]).
  directive('phoneValidator', [function () {
    return {
      require: "ngModel",
      link: function (scope, element, attr, ngModel) {
        if (!ngModel) return;
        var reg_start = /^[1-9]/;
        var reg_number = /[^\d]/;
        var valid, number;

        var phoneValidator = function (value) {
          valid = reg_start.test(value);
          number = !reg_number.test(value);
          ngModel.$setValidity("startWithZero", valid);
          ngModel.$setValidity("hasLetter", number);
          return (valid && number) ? value : undefined;
        };
        ngModel.$parsers.push(phoneValidator);
      }
    };
  }]);
