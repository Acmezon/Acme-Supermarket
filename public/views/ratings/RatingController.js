'use strict'

angular.module('acme_supermarket').registerCtrl('RatingCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

	$scope.Math = Math;

	$scope.submit = function () {
		$http.post('/api/ratings/manage',
		{
			customer_id: $scope.customer_id,
			product_id: $scope.product_id,
			value: $scope.value
		});
		$window.location.href = "/";
	};

}]);
