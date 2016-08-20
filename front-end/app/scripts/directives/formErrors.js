'use strict';

/**
 * @ngdoc directive
 * @name booksApp.directive:formErrors
 * @description
 * # formErrors
 */
angular.module('booksApp')
  .directive('formErrors', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directive/formErrors.html',
      scope: {
        'errors': '=errors'
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
      }
    };
  });
