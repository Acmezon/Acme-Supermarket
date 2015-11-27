'use strict'

angular.module('acme_supermarket').registerCtrl('SignupCtrl', ['$scope', '$http', function ($scope, $http) {
	
	// Function invoked by login submit
	$scope.submitSignUp = function() {
		$http.post('/api/signup', $scope.customer)
		.then(function success(response) {

		}, function error(response) {

		});

		return false;
	}

}]);