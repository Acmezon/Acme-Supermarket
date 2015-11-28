'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('acme_supermarket', [
        'ngRoute',
        'acme_supermarket.controllers',
        'acme_supermarket.filters',
        'acme_supermarket.services',
        'acme_supermarket.directives'
]);

app.config(['$routeProvider', '$locationProvider', '$controllerProvider',
 function ($routeProvider, $locationProvider, $controllerProvider) {
  app.registerCtrl = $controllerProvider.register;

  $routeProvider.
    when('/home', {
      templateUrl: 'views/public/home/home.html',
      controller: 'HomeCtrl'
    }).
    when('/signin', {
      templateUrl: 'views/public/signin/signin.html',
      controller: 'SigninCtrl'
    }).
    when('/signup', {
      templateUrl: 'views/public/signup/signup.html',
      controller: 'SignupCtrl'
    }).
    when('/protected', {
      templateUrl: 'views/customer/protected/protected.html',
      controller: 'ProtectedCtrl'
    }).
    otherwise({
      redirectTo: '/home'
    });

  $locationProvider.html5Mode(true);
}]);