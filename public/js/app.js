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
				'ngFileUpload',
				'firebase'
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
			activetab: 'home',
			title: 'Title.Home'
		}).
		when('/home', {
			templateUrl: 'views/public/home/home.html',
			controller: 'HomeCtrl',
			activetab: 'home',
			title: 'Title.Home'
		}).
		when('/contact', {
			templateUrl: 'views/public/home/contact.html',
			title: 'Title.Contact'
		}).
		when('/termsandconditions', {
			templateUrl: 'views/public/home/termsandconditions.html',
			title: 'Title.Terms'
		}).
		when('/cookies', {
			templateUrl: 'views/public/home/cookies.html',
			title: 'Title.Cookies'
		}).
		when('/about', {
			templateUrl: 'views/public/home/about.html',
			title: 'Title.About'
		}).
		when('/delivery', {
			templateUrl: 'views/public/home/delivery.html',
			title: 'Title.Delivery'
		}).
		when('/signin', {
			templateUrl: 'views/public/signin/signin.html',
			controller: 'SigninCtrl',
			resolve : {
				loggedin : notLoggedin
			},
			title: 'Title.Signin'
		}).
		when('/signout', {
			templateUrl: 'views/public/signout/signout.html',
			controller: 'SignoutCtrl',
			title: 'Title.Signout'
		}).
		when('/signup', {
			templateUrl: 'views/public/signup/signup.html',
			controller: 'SignupCtrl',
			resolve : {
				notloggedin : notLoggedin
			},
			title: 'Title.Signup'
		}).
		when('/myprofile', {
			templateUrl: 'views/user/profile/profile.html',
			controller: 'ProfileCtrl',
			resolve: {
				loggedin: checkLoggedin
			},
			activetab: 'account',
			title: 'Title.MyProfile'
		}).
		when('/mypurchasingrules', {
			templateUrl: 'views/user/rules/myrules.html',
			controller: 'MyRulesCtrl',
			resolve: {
				customer: checkCustomer
			},
			activetab : "account",
			title: 'Title.MyPurchasingRules'
		}).
		when('/products', {
			templateUrl: 'views/public/products/products.html',
			controller: 'ProductListCtrl',
			activetab: 'products',
			title: 'Title.Product.List'
		}).
		when('/myproducts', {
			templateUrl: 'views/public/products/products.html',
			controller: 'ProductListCtrl',
			resolve : {
				supplier: checkSupplier
			},
			activetab: 'account',
			title: 'Title.Product.MyProducts'
		}).
		when('/products/create', {
			templateUrl: 'views/products/create/createProduct.html',
			controller: 'CreateProductCtrl',
			resolve : {
				admin: checkAdmin
			},
			activetab: 'management',
			title: 'Title.Product.Creation'
		}).
		when('/product/:id', {
			templateUrl: 'views/products/product.html',
			controller: 'ProductDetailsCtrl',
			resolve: {
				loggedin: checkLoggedin
			},
			activetab: 'products',
			title: 'Title.Product.Details'
		}).
		when('/shoppingcart', {
			templateUrl: 'views/shoppingcart/shoppingcart.html',
			controller: 'ShoppingCartCtrl',
			resolve: {
				customer: checkCustomer
			},
			title: 'Title.ShoppingCart'
		}).
		when('/customers', {
			templateUrl: 'views/customer/customers.html',
			controller: 'CustomersCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management',
			title: 'Title.Customers'
		}).
		when('/dashboard', {
			templateUrl: 'views/dashboard/dashboard.html',
			controller: 'DashboardCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'socialmedia',
			title: 'Title.Dashboard'
		}).
		when('/checkout', {
			templateUrl: 'views/checkout/checkout.html',
			controller: 'CheckoutCtrl',
			resolve: {
				customer: checkCustomer
			},
			title: 'Title.Checkout.Checkout'
		}).
		when('/checkout/success/:id', {
			templateUrl: 'views/checkout/confirm.html',
			controller: 'CheckoutConfirmCtrl',
			resolve: {
				loggedin: checkLoggedin
			},
			title: 'Title.Checkout.Success'
		}).
		when('/checkout/error', {
			templateUrl: 'views/checkout/confirm.html',
			controller: 'CheckoutConfirmCtrl',
			resolve: {
				loggedin: checkLoggedin
			},
			title: 'Title.Checkout.Error'
		}).
		when('/mypurchases', {
			templateUrl: 'views/purchases/purchases.html',
			controller: 'PurchasesListCtrl',
			resolve: {
				customer: checkCustomer
			},
			activetab: 'account',
			title: 'Title.Purchase.MyPurchases'
		}).
		when('/purchases', {
			templateUrl: 'views/purchases/purchases.html',
			controller: 'PurchasesListCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management',
			title: 'Title.Puechase.List'
		}).
		when('/purchase/create', {
			templateUrl: 'views/purchases/purchase-creation.html',
			controller: 'PurchaseCreationCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management',
			title: 'Title.Purchase.Creation'
		}).
		when('/purchase/:id', {
			templateUrl: 'views/purchases/purchase.html',
			controller: 'PurchaseDetailsCtrl',
			resolve: {
				loggedin: checkLoggedin
			},
			title: 'Title.Purchase.Details'
		}).
		when('/management/rating', {
			templateUrl: 'views/ratings/rating-create.html',
			controller: 'RatingCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab : 'management',
			title: 'Title.RatingManagement'
		}).
		when('/management/discounts', {
			templateUrl: 'views/discounts/discounts.html',
			controller: 'DiscountListCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management',
			title: 'Title.Discounts'
		}).
		when('/purchasingrules', {
			templateUrl: 'views/purchasing_rules/purchasing-rules.html',
			controller: 'PurchasingRulesCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management',
			title: 'Title.PurchasingRules'
		}).
		when('/monitoringrules', {
			templateUrl: 'views/social_media_rules/socialmediarules.html',
			controller: 'SocialMediaRulesCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'socialmedia',
			title: 'Title.MonitoringRules.List'
		}).
		when('/monitoringrules/create', {
			templateUrl: 'views/social_media_rules/socialmediarule.html',
			controller: 'SocialMediaRuleCreateCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'socialmedia',
			title: 'Title.MonitoringRules.Creation'
		}).
		when('/notifications/:id', {
			templateUrl: 'views/notifications/notifications.html',
			controller: 'NotificationsCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'socialmedia',
			title: 'Title.Notifications'
		}).
		when('/reports', {
			templateUrl: 'views/reports/reports.html',
			controller: 'ReportCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'management',
			title: 'Title.Reports'
		}).
		when('/salesovertime', {
			templateUrl: 'views/businessintelligence/salesovertime.html',
			controller: 'SalesOverTimeCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'businessIntelligence',
			title: 'Title.SalesOverTime'
		}).
		when('/twitter', {
			templateUrl: 'views/businessintelligence/twitteranalysis.html',
			controller: 'TwitterAnalysisCtrl',
			resolve: {
				admin: checkAdmin
			},
			activetab: 'businessIntelligence',
			title: 'Title.TwitterAnalysis'
		}).
		when('/barcode', {
			templateUrl: 'views/barcode/barcode.html',
			controller: 'BarcodeCtrl',
			resolve: {
				admin: checkLoggedin
			},
			activetab: 'products',
			title: 'Title.Barcode'
		}).
		when('/todaydelivery', {
			templateUrl: 'views/routes/today-routes.html',
			controller: 'TodayRoutesCtrl',
			resolve: {
				admin: checkLoggedin
			},
			activetab: 'management',
			title: 'Title.TodayDelivery'
		}).
		when('/401', {
			templateUrl: 'views/public/errors/401.html',
			title: 'Title.401'
		}).
		when('/403', {
			templateUrl: 'views/public/errors/403.html',
			title: 'Title.403'
		}).
		when('/404', {
			templateUrl: 'views/public/errors/404.html',
			title: 'Title.404'
		}).
		when('/500', {
			templateUrl: 'views/public/errors/500.html',
			title: 'Title.500'
		}).
		when('/503', {
			templateUrl: 'views/public/errors/503.html',
			title: 'Title.503'
		}).
		otherwise({
			redirectTo: '/404',
		});

		$locationProvider.html5Mode(true);

		$translateProvider.useCookieStorage();
		$translateProvider.useUrlLoader('/api/lang');
		$translateProvider.preferredLanguage('en');
		$translateProvider.useSanitizeValueStrategy('escape');
	}
]);