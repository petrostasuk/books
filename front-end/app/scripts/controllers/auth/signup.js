'use strict';

/**
 * @ngdoc function
 * @name booksApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Controller of the booksApp
 */
angular.module('booksApp')
  .controller('SignUpCtrl', function ($scope, AuthService, $state) {

    $scope.signUpModel = {};
    $scope.formErrors = [];

    $scope.signUp = function () {

      AuthService.signUp($scope.signUpModel, function (errors, user) {
        if (errors) {
          $scope.formErrors = errors;
        } else {
          $scope.formErrors = [];
          $state.go('clear.login', {signup: true});
        }
      });

    }

  });
