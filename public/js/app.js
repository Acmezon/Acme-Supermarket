'use strict';

// Declare app level module which depends on filters, and services

angular.module('acme_supermarket', [
  'acme_supermarket.controllers',
  'acme_supermarket.filters',
  'acme_supermarket.services',
  'acme_supermarket.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/view1', {
      templateUrl: 'partials/partial1.html',
      controller: 'MyCtrl1'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2.html',
      controller: 'MyCtrl2'
    }).
    otherwise({
      redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
