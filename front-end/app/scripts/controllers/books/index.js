'use strict';

/**
 * @ngdoc function
 * @name booksApp.controller:BooksCtrl
 * @description
 * # BooksCtrl
 * Controller of the booksApp
 */
angular.module('booksApp')
  .controller('BooksCtrl', function ($scope, Book, api) {

    $scope.api = api;
    $scope.books = [];

    $scope.pagination = {
      current: 1,
      limit: 10,
      totalItems: 0
    };

    $scope.query = {
      search: null,
      sort: "bookId",
      limit: $scope.pagination.limit
    };

    $scope.previewBook = null;

    $scope.loadBooks = function () {
      $scope.query.skip = ($scope.pagination.current-1)*$scope.pagination.limit;
      Book.query($scope.query, function (books, headers) {
        $scope.books = books;
        $scope.pagination.totalItems = +headers('pagination-count');
      });
    };

    $scope.remove = function (book) {
      book.$delete(function () {
        if ($scope.previewBook && book._id == $scope.previewBook._id) {
          $scope.previewBook = null;
        }
        $scope.loadBooks();
      });
    };

    $scope.viewBook = function (book) {
      $scope.previewBook = book;
    };

    $scope.changeStatus = function (status, book) {
      book.status = status;
      book.$save();
    };

    $scope.clearSearch = function () {
      $scope.query.search = null;
      $scope.loadBooks();
    };

    $scope.setOrder = function (field) {
      if ($scope.query.sort == field) {
        $scope.query.sort = '-' + field;
      } else {
        $scope.query.sort = field;
      }
      $scope.loadBooks();
    };

    $scope.loadBooks();

  });
