'use strict';

/**
 * @ngdoc service
 * @name booksApp.Book
 * @description
 * # Book
 * Service in the booksApp.
 */
angular.module('booksApp')
  .factory('Book', function ($resource, api) {
    return $resource(
      api.host + '/books/:id',
      {
        id:'@_id'
      }
    );
  });
