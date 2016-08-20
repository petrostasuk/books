'use strict';

/**
 * @ngdoc function
 * @name booksApp.controller:BookFormCtrl
 * @description
 * # BookFormCtrl
 * Controller of the booksApp
 */
angular.module('booksApp')
  .controller('BookFormCtrl', function ($scope, Book, $state, $stateParams, $http, api) {

    $scope.image = null;
    $scope.file = null;

    if ($stateParams.id) {
      Book.get({id: $stateParams.id}, function (book) {
        $scope.book = book;
      }, function (err) {
        $state.go('clear.notFound', {replace: true});
      })
    } else {
      $scope.book = new Book;
      $scope.book.status = false;
    }

    $scope.save = function () {
      var fd = new FormData();
      fd.append("data", JSON.stringify($scope.book));
      fd.append('file', $scope.file);
      fd.append('image', $scope.image);
      $http.post(api.host + '/books' + ($scope.book._id ? '/' + $scope.book._id : ''), fd, {
        headers: {
          'Content-Type': undefined
        }
      }).success(function () {
        $state.go('clear.books');
      }).error(function (responce) {
        if (responce.errors) {
          $scope.formErrors = [];
          for (var field in responce.errors) {
            $scope.formErrors.push({msg: responce.errors[field].message});
          }
        }
      });
    };

    $scope.openFileDialog = function (inputId) {
      angular.element(inputId).click();
    };

    $scope.cancel = function () {
      $state.go('clear.books');
    }

  });
