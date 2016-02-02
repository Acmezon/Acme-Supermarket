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
				'ngTable',
				'ngFileUpload'
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
				if (response.data.success) {
					deferred.resolve();
				}
				// Not Authenticated
				else {
					$rootScope.loginFailed = true;
					deferred.reject();
					$location.url('/401');
				}
			}, function error(response) {
				$rootScope.loginFailed = true;
				deferred.reject();
				$location.url('/401');
			});
			return deferred.promise;
		};

		var notLoggedin = function($q, $timeout, $http, $location, $rootScope){
			// Initialize a new promise
			var deferred = $q.defer();

			// Make an AJAX call to check if the user is logged in
			$http.get('/islogged').then(function success(response){
				// Not Authenticated
				if (!response.data.success) {
					deferred.resolve();
				}
				// Authenticated
				else {
					deferred.reject();
					$location.url('/');
				}
			}, function error(response) {
				deferred.reject();
				$location.url('/');
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
					if (role=='anonymous') {
						$rootScope.loginFailed = true;
						deferred.reject();
						$location.url('/401');
					} else {
						$rootScope.loginFailed = true;
						deferred.reject();
						$location.url('/403');
					}
				}
			}, function error(response){
				$rootScope.loginFailed = true;
				deferred.reject();
				$location.url('/403');
			});
			return deferred.promise;
		};

		var checkAdmin = function ($q, $location, $http, $rootScope){
			// Initialize a new promise
			var deferred = $q.defer();

			$http.get('/api/getUserRole').then(function success(response) {
				var role = response.data;
				if (role=='admin') {
					deferred.resolve();

				} else {
					// A not admin shouldn't enter in the url
					if (role=='anonymous') {
						$rootScope.loginFailed = true;
						deferred.reject();
						$location.url('/401');
					} else {
						$rootScope.loginFailed = true;
						deferred.reject();
						$location.url('/403');
					}
				}
			}, function error(response){
				$rootScope.loginFailed = true;
				deferred.reject();
				$location.url('/403');
			});
			return deferred.promise;
		};

		var checkSupplier = function ($q, $location, $http, $rootScope){
			// Initialize a new promise
			var deferred = $q.defer();

			$http.get('/api/getUserRole').then(function success(response) {
				var role = response.data;
				if (role=='supplier') {
					deferred.resolve();

				} else {
					// A not customer shouldn't enter in the url
					if (role=='anonymous') {
						$rootScope.loginFailed = true;
						deferred.reject();
						$location.url('/401');
					} else {
						$rootScope.loginFailed = true;
						deferred.reject();
						$location.url('/403');
					}
				}
			}, function error(response){
				$rootScope.loginFailed = true;
				deferred.reject();
				$location.url('/403');
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
							$location.url('/403');
							break;
					}
					
					return $q.reject(response);
				}
			};
		});

		$routeProvider.
		when('/', {
			templateUrl: 'views/public/home/home.html',
			controller: 'HomeCtrl',
			activetab: 'home'
		}).
		when('/home', {
			templateUrl: 'views/public/home/home.html',
			controller: 'HomeCtrl',
			activetab: 'home'
		}).
		when('/contact', {
			templateUrl: 'views/public/home/contact.html',
		}).
		when('/termsandconditions', {
			templateUrl: 'views/public/home/termsandconditions.html',
		}).
		when('/cookies', {
			templateUrl: 'views/public/home/cookies.html',
		}).
		when('/about', {
			templateUrl: 'views/public/home/about.html',
		}).
		when('/delivery', {
			templateUrl: 'views/public/home/delivery.html',
		}).
		when('/signin', {
			templateUrl: 'views/public/signin/signin.html',
			controller: 'SigninCtrl',
			resolve : {
				loggedin : notLoggedin
			}
		}).
		when('/signout', {
			templateUrl: 'views/public/signout/signout.html',
			controller: 'SignoutCtrl'
		}).
		when('/signup', {
			templateUrl: 'views/public/signup/signup.html',
			controller: 'SignupCtrl',
			resolve : {
				notloggedin : notLoggedin
			}
		}).
		when('/myprofile', {
			templateUrl: 'views/user/profile/profile.html',
			controller: 'ProfileCtrl',
			resolve: {
				loggedin: checkLoggedin
			},
			activetab: 'account'
		}).
		when('/mypurchasingrules', {
			templateUrl: 'views/user/rules/myrules.html',
			controller: 'MyRulesCtrl',
			resolve: {
				customer: checkCustomer
			}
		}).
		when('/products', {
			templateUrl: 'views/public/products/products.html',
			controller: 'ProductListCtrl',
			activetab: 'products'
		}).
		when('/myproducts', {
			templateUrl: 'views/public/products/products.html',
			controller: 'ProductListCtrl',
			resolve : {
				supplier: checkSupplier
			},
			activetab: 'account'
		}).
		when('/products/create', {
			templateUrl: 'views/products/create/createProduct.html',
			controller: 'CreateProductCtrl',
			resolve : {
				admin: checkAdmin
			},
			activetab: 'management'
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
				customer: checkCustomer
			},
			activetab: 'account'
		}).
		when('/customers', {
			templateUrl: 'views/customer/customers.html',
			controller: 'CustomersCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management'
		}).
		when('/dashboard', {
			templateUrl: 'views/dashboard/dashboard.html',
			controller: 'DashboardCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management'
		}).
		when('/checkout', {
			templateUrl: 'views/checkout/checkout.html',
			controller: 'CheckoutCtrl',
			resolve: {
				customer: checkCustomer
			}
		}).
		when('/checkout/success/:id', {
			templateUrl: 'views/checkout/confirm.html',
			controller: 'CheckoutConfirmCtrl',
			resolve: {
				loggedin: checkLoggedin
			}
		}).
		when('/checkout/error', {
			templateUrl: 'views/checkout/confirm.html',
			controller: 'CheckoutConfirmCtrl',
			resolve: {
				loggedin: checkLoggedin
			}
		}).
		when('/mypurchases', {
			templateUrl: 'views/purchases/purchases.html',
			controller: 'PurchasesListCtrl',
			resolve: {
				customer: checkCustomer
			},
			activetab: 'account'
		}).
		when('/purchases', {
			templateUrl: 'views/purchases/purchases.html',
			controller: 'PurchasesListCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management'
		}).
		when('/purchase/create', {
			templateUrl: 'views/purchases/purchase-creation.html',
			controller: 'PurchaseCreationCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management'
		}).
		when('/purchase/:id', {
			templateUrl: 'views/purchases/purchase.html',
			controller: 'PurchaseDetailsCtrl',
			resolve: {
				loggedin: checkLoggedin
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
		$translateProvider.useSanitizeValueStrategy('escape');
	}
]);