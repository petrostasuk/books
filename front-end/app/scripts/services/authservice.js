'use strict';

/**
 * @ngdoc service
 * @name booksApp.booksApp
 * @description
 * # AuthService
 * Factory in the booksApp.
 */
angular.module('booksApp')
  .factory('AuthService', function ($http, api) {
    var currentUser = null;

    return {
      isLoggedIn: function() {
        return currentUser !== null;
      },
      setCurrentUser: function (user) {
        currentUser = user;
      },
      currentUser: function() {
        if (currentUser===null) {
          $http.get(api.host + "/user/me").then(function (responce) {
            if (responce.data) {
              currentUser = responce.data;
            }
          }, function () {
            currentUser = null;
          });
        } else {
          return currentUser;
        }
      },
      logout: function(sendRequest) {
        if (sendRequest === true) {
          $http.get(api.host + '/logout').then(function () {
            currentUser = null;
          });
        } else {
          currentUser = null;
        }
      },

      login: function (loginData, callback) {
        $http.post(api.host + '/login', loginData).then(function (responce) {
          callback(null, responce.data);
        }, function (responce) {
          callback(responce.data, null);
        })
      },

      signUp: function (signupData, callback) {
        $http.post(api.host + '/signup', signupData).then(function (responce) {
          callback(null, responce.data);
        }, function (responce) {
          callback(responce.data, null);
        })
      }
    };
  });
