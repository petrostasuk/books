'use strict';

/**
 * @ngdoc service
 * @name booksApp.authInterceptorService
 * @description
 * # authInterceptorService
 * Factory in the booksApp.
 */
angular.module('booksApp')
  .factory('authInterceptorService', function ($q, $injector) {
    var responseError = function (rejection) {
      if (rejection.status === 401) {
        $injector.get('AuthService').logout();
      }
      return $q.reject(rejection);
    };

    return {
      responseError: responseError
    };
  });
