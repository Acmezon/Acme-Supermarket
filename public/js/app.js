'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('acme_supermarket', 
			[
				'ngRoute',
				'ngResource',
				'ngCookies',
				'ngAnimate',
				'xeditable',
				'acme_supermarket.controllers',
				'acme_supermarket.filters',
				'acme_supermarket.services',
				'acme_supermarket.directives',
				'pascalprecht.translate',
				'ui.bootstrap',
				'ngToast',
				'credit-cards',
				'ngTable'
			]
	);

app.run(function(editableOptions) {
	editableOptions.theme = 'bs3';
});

app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$httpProvider', '$translateProvider', 'ngToastProvider',
	function ($routeProvider, $locationProvider, $controllerProvider, $httpProvider, $translateProvider, ngToast) {
		app.registerCtrl = $controllerProvider.register;

		ngToast.configure({
			horizontalPosition: 'center',
			animation: 'fade'
		})

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
					deferred.reject();
					$location.url('/signin');
				}
			}, function error(response) {
				$rootScope.loginFailed = true;
				deferred.reject();
				$location.url('/signin');
			});
			return deferred.promise;
		};

		var checkCustomer = function ($q, $location, $http, $rootScope){
			// Initialize a new promise
			var deferred = $q.defer();

			$http.get('/api/getUserRole').then(function success(response) {
				var role = response.data;

				if (role=='customer') {
					deferred.resolve();

				} else {
					// A not customer shouldn't enter in the url
					$rootScope.loginFailed = true;
					deferred.reject();
					$location.url('/signin');
				}
			}, function error(response){
				$rootScope.loginFailed = true;
				deferred.reject();
				$location.url('/signin');
			});
			return deferred.promise;
		};

		var checkAdmin = function ($q, $location, $http, $rootScope){
			// Initialize a new promise
			var deferred = $q.defer();

			$http.get('/api/getUserRole').then(function success(response) {
				var role = response.data;
				console.log(role)

				if (role=='admin') {
					deferred.resolve();

				} else {
					// A not customer shouldn't enter in the url
					$rootScope.loginFailed = true;
					deferred.reject();
					$location.url('/signin');
				}
			}, function error(response){
				$rootScope.loginFailed = true;
				deferred.reject();
				$location.url('/signin');
			});

			return deferred.promise;
		};

		var checkSupplier = function ($q, $location, $http, $rootScope){
			// Initialize a new promise
			var deferred = $q.defer();

			$http.get('/api/getUserRole').then(function success(response) {
				var role = response.data;
				console.log(role)
				
				if (role=='supplier') {
					deferred.resolve();

				} else {
					// A not customer shouldn't enter in the url
					$rootScope.loginFailed = true;
					deferred.reject();
					$location.url('/signin');
				}
			}, function error(response){
				$rootScope.loginFailed = true;
				deferred.reject();
				$location.url('/signin');
			});

			return deferred.promise;
		};

		$httpProvider.interceptors.push(function($q, $location) {
			return {
				response: function(response) {
					return response;
				},
				responseError: function(response) {
					switch (response.status) {
						case 401:
							$location.url('/401');
							break;
						case 403:
							$location.url('/403');
							break;
						case 404:
							$location.url('/404');
							break;
						case 500:
							$location.url('/500');
							break;
						case 503:
							$location.url('/503');
							break;
						default:
							$location.url('/401');
							break;
					}
					
					return $q.reject(response);
				}
			};
		});

		$routeProvider.
		when('/', {
			templateUrl: 'views/public/home/home.html',
			controller: 'HomeCtrl'
		}).
		when('/home', {
			templateUrl: 'views/public/home/home.html',
			controller: 'HomeCtrl'
		}).
		when('/signin', {
			templateUrl: 'views/public/signin/signin.html',
			controller: 'SigninCtrl'
		}).
		when('/signout', {
			templateUrl: 'views/public/signout/signout.html',
			controller: 'SignoutCtrl'
		}).
		when('/signup', {
			templateUrl: 'views/public/signup/signup.html',
			controller: 'SignupCtrl'
		}).
		when('/myprofile', {
			templateUrl: 'views/user/profile/profile.html',
			controller: 'ProfileCtrl',
			resolve: {
				loggedin: checkLoggedin
			}
		}).
		when('/products', {
			templateUrl: 'views/public/products/products.html',
			controller: 'ProductListCtrl'
		}).
		when('/product/:id', {
			templateUrl: 'views/products/product.html',
			controller: 'ProductDetailsCtrl',
			resolve: {
				loggedin: checkLoggedin
			}
		}).
		when('/shoppingcart', {
			templateUrl: 'views/shoppingcart/shoppingcart.html',
			controller: 'ShoppingCartCtrl',
			resolve: {
				loggedin: checkLoggedin,
				customer: checkCustomer
			}
		}).
		when('/customers', {
			templateUrl: 'views/customer/customers.html',
			controller: 'CustomersCtrl',
			resolve: {
				loggedin: checkLoggedin,
				admin: checkAdmin
			}
		}).
		when('/401', {
			templateUrl: 'views/public/errors/401.html'
		}).
		when('/403', {
			templateUrl: 'views/public/errors/403.html'
		}).
		when('/404', {
			templateUrl: 'views/public/errors/404.html'
		}).
		when('/500', {
			templateUrl: 'views/public/errors/500.html'
		}).
		when('/503', {
			templateUrl: 'views/public/errors/503.html'
		}).
		otherwise({
			redirectTo: '/404'
		});

		$locationProvider.html5Mode(true);

		$translateProvider.useCookieStorage();
		$translateProvider.useUrlLoader('/api/lang');
		$translateProvider.preferredLanguage('en');
	}
]);