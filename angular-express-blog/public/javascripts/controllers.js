"use strict";

/* Controllers */
// posts
function IndexCtrl($scope, $http, $rootScope) {
  $http.get('/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
      $rootScope.haslogin = data.user.logined;
      $rootScope.username = data.user.username;
      $rootScope.role = data.user.role;
    });
}

function AddPostCtrl($scope, $http, $location, $rootScope) {
  $scope.form = {};
  $scope.submitPost = function () {
    if (!$rootScope.haslogin || !$scope.form.title || !$scope.form.text) return;
    $http.post('/posts/add', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/posts/get/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.showPost = function() {
    $http.put('/posts/show/' + $scope.post.id).
      success(function(data) {
        if (data.success) {
          $http.get('/posts/get/' + $scope.post.id).
            success(function(response) {
              $scope.post = response.post;
            });
        }
      });
  };

  $scope.hidePost = function() {
    $http.put('/posts/hide/' + $scope.post.id).
      success(function(data) {
        if (data.success) {
          $scope.post.hide = true;
          $scope.post.text = 'This content has been hidden by the administrator';
        }
      });
  };
}

function EditPostCtrl($scope, $http, $location, $routeParams, $rootScope) {
  $scope.form = {};
  $http.get('/posts/get/' + $routeParams.id).
    success(function(data) {
      if (!$rootScope.haslogin || data.post.author !== $rootScope.username) {
        $location.url('/');
      } else {
        $scope.form = data.post;
      }
    });

  $scope.editPost = function() {
    $http.put('/posts/edit/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };

  $scope.backPost = function() {
    var reg_url = /editPost\/(.+)/;
    var url = reg_url.exec($location.url());
    if (!url) $location.url('/');
    else $location.url('/readPost/' + url[1]);
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams, $rootScope) {
  $http.get('/posts/get/' + $routeParams.id).
    success(function(data) {
      if (!$rootScope.haslogin || data.post.author !== $rootScope.username) {
        $location.url('/');
      } else {
        $scope.post = data.post;
      }
    });

  $scope.deleteCommentId = null;
  $scope.deletePost = function () {
    $http.delete('/posts/delete/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

// authorization
function LoginCtrl($scope, $http, $location, $rootScope) {
  $scope.form = {};
  $scope.closeAlert = function () {
    $rootScope.loginInfo = null;
  };
  $scope.loginPost = function () {
    $http.post('/authorization/login', $scope.form).
      success(function(data) {
        if (data.success) {
          $rootScope.haslogin = true;
          $rootScope.username = data.data.username;
          $rootScope.role = data.data.role;
          $location.path('/');
        } else {
          $rootScope.loginInfo = data.data.info;
        }
      });
  };
}

function RegistCtrl($scope, $http, $location, $rootScope) {
  $scope.form = {};
  $scope.registPost = function () {
    $http.post('/authorization/regist', $scope.form).
      success(function(data) {
        if (data.success) {
          $rootScope.haslogin = true;
          $rootScope.username = data.data.username;
          $rootScope.role = data.data.role;
          $location.path('/');
        }
      });
  };
}

function LogoutCtrl($scope, $http, $location, $rootScope) {
  $http.get('/authorization/logout').
    success(function(data) {
      if (data.success) {
        $rootScope.haslogin = false;
        $rootScope.username = 'guest';
        $rootScope.role = null;
        $location.path('/login');
      }
    });
}

// comments
angular.module('myApp').controller('commentsCtrl', function($scope, $rootScope, $http) {
    $scope.form = {};
    $scope.addComment = function() {
      if (!$rootScope.haslogin || !$scope.form.content) return;
      $scope.form.post = $scope.post.id;
      $http.post('/comments/add', $scope.form).
        success(function(data) {
          if (data.success) {
            $scope.form.content = '';
            $http.get('/comments/getbypost/' + $scope.post.id).
              success(function(commentsData) {
                $scope.post.comments = commentsData.comments;
              });
          }
        });
    };

    $scope.deleteComment = function(commentid) {
      if (!$rootScope.haslogin) return;
      $scope.deleteCommentId = commentid;
      $('#deleteComment-modal').modal('show');
    };

    $scope.deleteConfirm = function() {
      if (!$scope.deleteCommentId) return;
      $http.delete('/comments/delete/' + $scope.deleteCommentId).
        success(function(data) {
          if (data.success) {
            $scope.form.content = '';
            $scope.deleteCommentId = null;
            $http.get('/comments/getbypost/' + $scope.post.id).
              success(function(commentsData) {
                $scope.post.comments = commentsData.comments;
              });
          }
        });
      $('#deleteComment-modal').modal('hide');
    };

    $scope.editComment = function(commentid) {
      if (!$rootScope.haslogin || !commentid) return;

      $http.get('/comments/get/' + commentid).
        success(function(data) {
          if (data.success) {
            $scope.editCommentForm = data.comment;
            $('#editComment-modal').modal('show');
          }
        });
    };

    $scope.editConfirm = function() {
      if (!$rootScope.haslogin || !$scope.editCommentForm || !$scope.editCommentForm.content) return;
      $http.put('/comments/edit/' + $scope.editCommentForm.id, $scope.editCommentForm).
        success(function(data) {
          if (data.success) {
            $scope.editCommentForm = null;
            $http.get('/comments/getbypost/' + $scope.post.id).
              success(function(commentsData) {
                $scope.post.comments = commentsData.comments;
              });
          }
        });
      $('#editComment-modal').modal('hide');
    };

    $scope.hideComment = function(commentid) {
      $http.put('/comments/hide/' + commentid).
        success(function(data) {
          if (data.success) {
            $http.get('/comments/getbypost/' + $scope.post.id).
              success(function(commentsData) {
                $scope.post.comments = commentsData.comments;
              });
          }
        });
    };

    $scope.showComment = function(commentid) {
      $http.put('/comments/show/' + commentid).
        success(function(data) {
          if (data.success) {
            $http.get('/comments/getbypost/' + $scope.post.id).
              success(function(commentsData) {
                $scope.post.comments = commentsData.comments;
              });
          }
        });
    };
});
