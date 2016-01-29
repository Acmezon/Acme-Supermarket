'use strict'

angular.module('acme_supermarket').registerCtrl('CheckoutConfirmCtrl', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {

	if ($location.path().split("/")[2]=='success') {
		$scope.success = true;
		$scope.state = 'Success';

		console.log($routeParams)

		// Purchase
		$http({
			method: 'GET',
			url: '/api/purchase/' + $routeParams.id
		}).
		then(function success(response) {
			$scope.purchase = response.data;
			console.log($scope.purchase)
		}, function error(response) {
		});





	} else {
		$scope.success = false;
		$scope.state = 'Error';
	}



}]);