'use strict'

angular.module('acme_supermarket').registerCtrl('MainCtrl', ['$scope', '$http', '$window', '$rootScope', '$cookies', function ($scope, $http, $window, $rootScope, $cookies) {
	
	// Function invoked by login submit
	$scope.signout = function() {
		$http.get('/api/signout')
		.then(function success(response) {
			$window.location.href = '/';
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