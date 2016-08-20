'use strict';

/**
 * @ngdoc function
 * @name booksApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the booksApp
 */
angular.module('booksApp')
  .controller('LoginCtrl', function ($scope, AuthService, $state, $stateParams) {

    $scope.loginModel = {};
    $scope.formErrors = [];

    $scope.successSignup = (typeof $stateParams.signup !== 'undefined');

    $scope.login = function () {

      AuthService.login($scope.loginModel, function (errors, user) {
        if (errors) {
          $scope.formErrors = errors;
        } else {
          AuthService.setCurrentUser(user);
          $state.go('clear.books');
        }
      });

    }

  });
