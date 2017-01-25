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
        var valid;

        var usernameValidator = function (value) {
          valid = false;
          if (!value) {
            scope.registUsernameInfo = "Username can't be empty";
          } else if (!reg_alp.test(value)) {
            scope.registUsernameInfo = "Username must start with letter";
          } else if (value.length < 6 || value.length > 18) {
            scope.registUsernameInfo = "Length must be between 6 and 18";
          } else if (!reg.test(value)) {
            scope.registUsernameInfo = "Username is not valid";
          } else {
            scope.registUsernameInfo = "";
            valid = true;
          }
          ngModel.$setValidity("usernameValid", valid);
          return valid ? value : undefined;
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
          valid = false;
          if (!value) {
            scope.registPasswordInfo = "Password can't be empty";
          } else if (value.length < 6 || value.length > 12) {
            scope.registPasswordInfo = "Length must be between 6 and 12";
          } else if (!reg.test(value)) {
            scope.registPasswordInfo = "Password is not valid";
          } else {
            scope.registPasswordInfo = "";
            valid = true;
          }
          if (scope.form.confirm !== value) {
            scope.registConfirmInfo = "Passwords are not consistent";
          } else if (valid) {
            scope.registConfirmInfo = '';
          }
          ngModel.$setValidity("valid", valid);
          return valid ? value : undefined;
        };
        ngModel.$parsers.push(passwordValidator);
      }
    };
  }]).
  directive('confirmValidator', [function () {
    return {
      require: "ngModel",
      link: function (scope, element, attr, ngModel) {
        if (!ngModel) return;
        var reg = /^[0-9a-zA-Z\-_]{6,12}$/;
        var valid;

        var confirmValidator = function (value) {
          valid = false;
          if (!value) {
            scope.registConfirmInfo = "Confirm can't be empty";
          } else if (value.length < 6 || value.length > 12) {
            scope.registConfirmInfo = "Length must be between 6 and 12";
          } else if (!reg.test(value)) {
            scope.registConfirmInfo = "Confirm is not valid";
          } else if (scope.form.password !== value) {
            scope.registConfirmInfo = "Passwords are not consistent";
          } else {
            scope.registConfirmInfo = "";
            valid = true;
          }
          ngModel.$setValidity("valid", valid);
          return valid ? value : undefined;
        };
        ngModel.$parsers.push(confirmValidator);
      }
    };
  }]).
  directive('stuidValidator', [function () {
    return {
      require: "ngModel",
      link: function (scope, element, attr, ngModel) {
        if (!ngModel) return;
        var reg = /^[1-9]\d{7}$/;
        var reg_number = /[^\d]/;
        var valid;

        var stuidValidator = function (value) {
          valid = false;
          if (!value) {
            scope.registStuidInfo = "Student Number can't be empty";
          } else if (value[0] === '0') {
            scope.registStuidInfo = "Student Number can not start with 0";
          } else if (reg_number.test(value)) {
            scope.registStuidInfo = "Student Number must be number";
          } else if (value.length !== 8) {
            scope.registStuidInfo = "Student Number length must be 8";
          } else if (!reg.test(value)) {
            scope.registStuidInfo = "Student Number is not valid";
          } else {
            scope.registStuidInfo = "";
            valid = true;
          }

          ngModel.$setValidity("valid", valid);
          return valid ? value : undefined;
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
          valid = false;
          if (!value) {
            scope.registEmailInfo = "Email can't be empty";
          } else if (!reg.test(value)) {
            scope.registEmailInfo = "Email is not valid";
          } else {
            valid = true;
            scope.registEmailInfo = "";
          }
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
        var reg = /^[1-9]\d{10}$/;
        var reg_number = /[^\d]/;
        var valid;

        var phoneValidator = function (value) {
          valid = false;
          if (!value) {
            scope.registPhoneInfo = "Mobile phone can't be empty";
          } else if (value[0] === '0') {
            scope.registPhoneInfo = "Mobile phone can not start with 0";
          } else if (reg_number.test(value)) {
            scope.registPhoneInfo = "Mobile phone must be number";
          } else if (value.length !== 11) {
            scope.registPhoneInfo = "Mobile phone length must be 11";
          } else if (!reg.test(value)) {
            scope.registPhoneInfo = "Mobile phone is not valid";
          } else {
            scope.registPhoneInfo = "";
            valid = true;
          }

          ngModel.$setValidity("valid", valid);
          return valid ? value : undefined;
        };
        ngModel.$parsers.push(phoneValidator);
      }
    };
  }]);
