'use strict'

angular.module('acme_supermarket').registerCtrl('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/api/products'
	}).
	then(function success(response1) {
		$scope.products = response1.data;
		$scope.products.forEach(function(product) {
    		$http({
				method: 'GET',
				url: '/api/providesByProductId/' + product._id
			}).
			then(function success(response2) {
				var provides = response2.data;
				var minMax = minMaxPrices(provides);
				product.minPrice = minMax[0];
				product.maxPrice = minMax[1]; 
			});
		});
	}, function error(response1) {
	});


	var minMaxPrices = function (provides) {
		var lowest = Number.POSITIVE_INFINITY;
		var highest = Number.NEGATIVE_INFINITY;
		var tmp;
		for (var i = provides.length - 1; i >= 0; i--) {
		    tmp = provides[i].price;
		    if (tmp < lowest) lowest = tmp;
		    if (tmp > highest) highest = tmp;
		}
		return [lowest, highest];
	}
}]);