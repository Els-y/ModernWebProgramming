"use strict";

/* Controllers */
// posts
function IndexCtrl($scope, $http, $rootScope, $filter) {
  $scope.posts = {
    currentPage: 1,
    postPerPage: 4,
    maxSize: 8,
    totalPosts: [],
    filterPosts: [],
    currentStart: 0,
    currentEnd: 0,
    currentPosts: []
  };

  $scope.$watch('postsQuery', function(newValue, oldValue) {
    var reg = new RegExp(newValue);

    $scope.posts.currentPage = 1;
    if (!newValue) {
      $scope.posts.filterPosts = $scope.posts.totalPosts;
    } else {
      $scope.posts.filterPosts = $scope.posts.totalPosts.filter(function(post, i) {
        if (reg.test(post.title) || reg.test(post.text)) return true;
        else return false;
      });
    }

    $scope.posts.currentStart = $scope.posts.postPerPage * ($scope.posts.currentPage - 1);
    $scope.posts.currentEnd = $scope.posts.currentStart + $scope.posts.postPerPage;
    $scope.posts.currentPosts = $scope.posts.filterPosts.slice($scope.posts.currentStart, $scope.posts.currentEnd);
  });

  $http.get('/posts').then(function successCallback(response) {
    $scope.posts.totalPosts = $scope.posts.filterPosts = response.data.posts;

    $scope.posts.currentStart = $scope.posts.postPerPage * ($scope.posts.currentPage - 1);
    $scope.posts.currentEnd = $scope.posts.currentStart + $scope.posts.postPerPage;
    $scope.posts.currentPosts = $scope.posts.totalPosts.slice($scope.posts.currentStart, $scope.posts.currentEnd);

    $rootScope.haslogin = response.data.user.logined;
    $rootScope.username = response.data.user.username;
    $rootScope.role = response.data.user.role;
  });

  $scope.pageChanged = function() {
    $scope.currentStart = $scope.postPerPage * ($scope.currentPage - 1);
    $scope.currentEnd = $scope.currentStart + $scope.postPerPage;
    $scope.currentPosts = $scope.totalPosts.slice($scope.currentStart, $scope.currentEnd);
  };
}

function AddPostCtrl($scope, $http, $location, $rootScope) {
  $scope.form = {};
  $scope.submitPost = function () {
    if (!$rootScope.haslogin || !$scope.form.title || !$scope.form.text) return;
    $http.post('/posts/add', $scope.form).then(function successCallback(response) {
      $location.path('/');
    });
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/posts/get/' + $routeParams.id).then(function successCallback(response) {
    $scope.post = response.data.post;
  });

  $scope.showPost = function() {
    $http.put('/posts/show/' + $scope.post.id).then(function successCallback(response) {
      if (response.data.success) {
        $http.get('/posts/get/' + $scope.post.id).then(function successCallback(response) {
          $scope.post = response.data.post;
        });
      }
    });
  };

  $scope.hidePost = function() {
    $http.put('/posts/hide/' + $scope.post.id).then(function successCallback(response) {
      if (response.data.success) {
        $scope.post.hide = true;
        $scope.post.text = 'This content has been hidden by the administrator';
      }
    });
  };
}

function EditPostCtrl($scope, $http, $location, $routeParams, $rootScope) {
  $scope.form = {};
  $http.get('/posts/get/' + $routeParams.id).then(function successCallback(response) {
    if (!$rootScope.haslogin || response.data.post.author !== $rootScope.username) {
      $location.url('/');
    } else {
      $scope.form = response.data.post;
    }
  });

  $scope.editPost = function() {
    $http.put('/posts/edit/' + $routeParams.id, $scope.form).then(function successCallback(response) {
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
  $http.get('/posts/get/' + $routeParams.id).then(function successCallback(response) {
    if (!$rootScope.haslogin || response.data.post.author !== $rootScope.username) {
      $location.url('/');
    } else {
      $scope.post = response.data.post;
    }
  });

  $scope.deleteCommentId = null;
  $scope.deletePost = function () {
    $http.delete('/posts/delete/' + $routeParams.id).then(function successCallback(response) {
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
    $http.post('/authorization/login', $scope.form).then(function successCallback(response) {
      if (response.data.success) {
        $rootScope.haslogin = true;
        $rootScope.username = response.data.data.username;
        $rootScope.role = response.data.data.role;
        $location.path('/');
      } else {
        $rootScope.loginInfo = response.data.data.info;
      }
    });
  };
}

function RegistCtrl($scope, $http, $location, $rootScope) {
  $scope.form = {};
  $scope.registPost = function () {
    $http.post('/authorization/regist', $scope.form).then(function successCallback(response) {
      if (response.data.success) {
        $rootScope.haslogin = true;
        $rootScope.username = response.data.data.username;
        $rootScope.role = response.data.data.role;
        $location.path('/');
      }
    });
  };
}

function LogoutCtrl($scope, $http, $location, $rootScope) {
  $http.get('/authorization/logout').then(function successCallback(response) {
    if (response.data.success) {
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
      $http.post('/comments/add', $scope.form).then(function successCallback(response) {
        if (response.data.success) {
          $scope.form.content = '';
          $http.get('/comments/getbypost/' + $scope.post.id).then(function successCallback(response) {
            $scope.post.comments = response.data.comments;
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
      $http.delete('/comments/delete/' + $scope.deleteCommentId).then(function successCallback(response) {
          if (response.data.success) {
            $scope.form.content = '';
            $scope.deleteCommentId = null;
            $http.get('/comments/getbypost/' + $scope.post.id).then(function successCallback(response) {
                $scope.post.comments = response.data.comments;
              });
          }
        });
      $('#deleteComment-modal').modal('hide');
    };

    $scope.editComment = function(commentid) {
      if (!$rootScope.haslogin || !commentid) return;

      $http.get('/comments/get/' + commentid).then(function successCallback(response) {
          if (response.data.success) {
            $scope.editCommentForm = response.data.comment;
            $('#editComment-modal').modal('show');
          }
        });
    };

    $scope.editConfirm = function() {
      if (!$rootScope.haslogin || !$scope.editCommentForm || !$scope.editCommentForm.content) return;
      $http.put('/comments/edit/' + $scope.editCommentForm.id, $scope.editCommentForm).then(function successCallback(response) {
        if (response.data.success) {
          $scope.editCommentForm = null;
          $http.get('/comments/getbypost/' + $scope.post.id).then(function successCallback(response) {
            $scope.post.comments = response.data.comments;
          });
        }
      });
      $('#editComment-modal').modal('hide');
    };

    $scope.hideComment = function(commentid) {
      $http.put('/comments/hide/' + commentid).then(function successCallback(response) {
        if (response.data.success) {
          $http.get('/comments/getbypost/' + $scope.post.id).then(function successCallback(response) {
            $scope.post.comments = response.data.comments;
          });
        }
      });
    };

    $scope.showComment = function(commentid) {
      $http.put('/comments/show/' + commentid).then(function successCallback(response) {
          if (response.data.success) {
            $http.get('/comments/getbypost/' + $scope.post.id).then(function successCallback(response) {
                $scope.post.comments = response.data.comments;
              });
          }
        });
    };
});

angular.module('myApp').controller('PaginationDemoCtrl', function ($scope, $log) {


  $scope.setPage = function (pageNo) {
    $scope.posts.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $scope.posts.currentStart = $scope.posts.postPerPage * ($scope.posts.currentPage - 1);
    $scope.posts.currentEnd = $scope.posts.currentStart + $scope.posts.postPerPage;
    $scope.posts.currentPosts = $scope.posts.filterPosts.slice($scope.posts.currentStart, $scope.posts.currentEnd);
  };

});
