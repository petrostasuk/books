'use strict';

/**
 * @ngdoc overview
 * @name booksApp
 * @description
 * # booksApp
 *
 * Main module of the application.
 */
angular
  .module('booksApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'angular-input-stars',
    'ui.bootstrap',
    'switcher'
  ])
  .config(function ($routeProvider, $stateProvider, $httpProvider, $locationProvider) {

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('authInterceptorService');

    $stateProvider
    // Client layout
      .state('clear', {
        abstract: true,
        templateUrl: "/views/layouts/clear.html"
      })
      .state('clear.login', {
        url: "/login?signup",
        controller: 'LoginCtrl',
        onlyForGuest: true,
        templateUrl: "/views/auth/login.html"
      })
      .state('clear.signup', {
        url: "/signup",
        onlyForGuest: true,
        controller: 'SignUpCtrl',
        templateUrl: "/views/auth/signup.html"
      })
      .state('clear.books', {
        url: "/",
        needToLogin: true,
        controller: 'BooksCtrl',
        templateUrl: "/views/books/index.html"
      })
      .state('clear.createBook', {
        url: "/books/create",
        needToLogin: true,
        controller: 'BookFormCtrl',
        templateUrl: "/views/books/form.html"
      })
      .state('clear.updateBook', {
        url: "/books/update/:id",
        needToLogin: true,
        controller: 'BookFormCtrl',
        templateUrl: "/views/books/form.html"
      })
      .state('clear.notFound', {
        url: "/notFound",
        controller: 'BookFormCtrl',
        templateUrl: "/views/notFound.html"
      });

    $routeProvider.otherwise({
      redirectTo: '/login'
    });
    $locationProvider.html5Mode(true);
    
  }).run(function (AuthService, $rootScope, $state) {

  AuthService.currentUser();
  $rootScope.isLoggedIn = false;

  var checkUserAccess = function (event, state) {
    if (!AuthService.isLoggedIn() && state.needToLogin === true) {
      if (event) {
        event.preventDefault();
      }
      $state.go('clear.login');
    } else if (AuthService.isLoggedIn() && state.onlyForGuest === true) {
      if (event) {
        event.preventDefault();
      }
      $state.go('clear.books');
    }
  };

  var currentState = {};

  $rootScope.$watch(AuthService.isLoggedIn, function (isLoggedIn) {
    $rootScope.isLoggedIn = isLoggedIn;
    if ($rootScope.isLoggedIn) {
      $rootScope.currentUser = AuthService.currentUser();
    } else {
      $rootScope.currentUser = null;
    }
    checkUserAccess(null, currentState);
  });

  $rootScope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams) {
      currentState = toState;
      checkUserAccess(event, toState);
    }
  )

}).constant('api', {
  host: '/api'
});
