'use strict'

angular.module('acme_supermarket').registerCtrl('ProductDetailsCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

	var id = $routeParams.id;

	$http({
		method: 'GET',
		url: '/api/product/'+id
	}).
	then(function success(response) {
		$scope.product = response.data;
	}, function error(response) {
	});
}]);