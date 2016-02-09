'use strict'

angular.module('acme_supermarket').registerCtrl('NotificationsCtrl', ['$scope', '$http', '$routeParams', 'ngTableParams', function ($scope, $http, $routeParams, ngTableParams) {

	var id = $routeParams.id;

	$http({
		method: 'GET',
		url: '/api/notifications/' + id
	}).
	then(function success(response) {
		var notifications = response.data;
		$scope.numNotifications = notifications.length;
		$scope.tableParams = new ngTableParams({}, {dataset:notifications, total: $scope.numNotifications});
	});

}]);