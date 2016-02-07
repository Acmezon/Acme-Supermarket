'use strict'

angular.module('acme_supermarket').registerCtrl('MainCtrl', ['$scope', '$http', '$window', '$rootScope', '$cookies', '$route', function ($scope, $http, $window, $rootScope, $cookies, $route) {

	$scope.$route = $route;
	
	$rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
		$rootScope.title = $route.current.title;
	});
	
	// Function invoked by login submit
	$scope.signout = function() {
		$http.get('/api/signout')
		.then(function success(response) {
			$window.location.href = '/';
		}, function error(response) {
			console.log(response);
		});
	}

	$scope.isAuthenticated = function() {
		$http.get('/islogged')
			.then(function success(response) {
				return response.data;
			}, function error(response) {
				console.log(response);
		});
	}

	$scope.productsInCart = function() {
		var r = 0;
		var cookie = $cookies.get("shoppingcart");
		if (cookie) {
			cookie = JSON.parse(cookie);
			if (!$.isEmptyObject(cookie)) {
				for (var id in cookie) {
					if (cookie.hasOwnProperty(id)) {
						r += cookie[id];
					}
				}
			}
		}
		return r;
	}

}]);