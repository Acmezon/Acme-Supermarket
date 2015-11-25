'use strict'

angular.module('acme_supermarket').registerCtrl('MyCtrl1', ['$scope', '$http', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/api/name'
	}).
	success(function (data, status, headers, config) {
		$scope.name = data.name;
	}).
	error(function (data, status, headers, config) {
		$scope.name = 'Error!';
	});
}]);