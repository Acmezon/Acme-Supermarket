'use strict'

angular.module('acme_supermarket').registerCtrl('TodayRoutesCtrl', ['$scope', '$http', function ($scope, $http) {

	$http({
		method: 'GET',
		url: '/api/routes/today'
	}).
	then(function success(response) {
		$scope.route = response.data
	}, function error(response) {
		// mensaje chungo
	});
}]);	