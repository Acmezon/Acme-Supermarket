'use strict'

angular.module('acme_supermarket').registerCtrl('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/api/products'
	}).
	success(function (data, status, headers, config) {
		$scope.products = data;
	}).
	error(function (data, status, headers, config) {
		
	});
}]);