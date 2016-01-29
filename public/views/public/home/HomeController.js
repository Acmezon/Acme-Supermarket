'use strict'

angular.module('acme_supermarket').registerCtrl('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/api/products/limit/' + 9
	}).
	then(function success(response1) {
		$scope.products = response1.data;
	}, function error(response1) {
	});

	$http.get('/api/myRecommendations').then(function success(products) {
		$http.post('/api/product/getByIdList', { products : products}).then(
			function success(product_list) {
				$scope.recommendedProducts = product_list.data;
			}, function error(response){});
	}, function error(response) {});
}]);