'use strict';

/**
 * @ngdoc directive
 * @name booksApp.directive:formErrors
 * @description
 * # formErrors
 */
angular.module('booksApp')
  .directive('booksHeader', function (AuthService) {
    return {
      restrict: 'E',
      templateUrl: 'views/directive/booksHeader.html',
      replace: true,
      link: function postLink(scope, element, attrs) {

        scope.logout = function () {
          AuthService.logout(true);
        }

      }
    };
  });
