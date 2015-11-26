'use strict'

angular.module('acme_supermarket').registerCtrl('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/api/products'
	}).
	then(function success(response) {
		//$scope.products = data;
		console.log("RES: " + response.data);
	}, function error(response) {
		console.log("ERROR: " + response);
	});
}]);