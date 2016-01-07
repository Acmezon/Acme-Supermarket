'use strict'

angular.module('acme_supermarket').registerCtrl('MainCtrl', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
	
	// Function invoked by login submit
	$scope.signout = function() {
		$http.get('/api/signout')
		.then(function success(response) {
			$window.location.href = '/';
		}, function error(response) {
			console.log(response);
		});
	}

}]);