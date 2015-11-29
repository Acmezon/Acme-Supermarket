'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('acme_supermarket', [
	'ngRoute',
	'ngResource',
	'acme_supermarket.controllers',
	'acme_supermarket.filters',
	'acme_supermarket.services',
	'acme_supermarket.directives'
	]);

app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$httpProvider',
	function ($routeProvider, $locationProvider, $controllerProvider, $httpProvider) {
		app.registerCtrl = $controllerProvider.register;

		var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
			// Initialize a new promise
			var deferred = $q.defer();

			// Make an AJAX call to check if the user is logged in
			$http.get('/islogged').then(function success(response){
				// Authenticated
				if (response.data.success)
					deferred.resolve();

				// Not Authenticated
				else {
					$rootScope.loginFailed = true;
					$rootScope.loginFailedMessage = 'You need to log in.';
					//$timeout(function(){deferred.reject();}, 0);
					deferred.reject();
					$location.url('/signin');
				}
			}, function error(response) {
				$rootScope.loginFailed = true;
				$rootScope.loginFailedMessage = 'You need to log in.';
			});

			return deferred.promise;
		};

		$httpProvider.interceptors.push(function($q, $location) {
			return {
				response: function(response) {
					return response;
				},
				responseError: function(response) {
					if (response.status === 401)
					$location.url('/signin');
					return $q.reject(response);
				}
			};
		});

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
		when('/customer/products', {
			templateUrl: 'views/customer/protected/protected.html',
			controller: 'ProtectedCtrl',
			resolve: {
				loggedin: checkLoggedin
			}
		}).
		when('/products', {
			templateUrl: 'views/products/products.html',
			controller: 'ProductListCtrl'
		}).
		otherwise({
			redirectTo: '/home'
		});

		$locationProvider.html5Mode(true);
	}
]);