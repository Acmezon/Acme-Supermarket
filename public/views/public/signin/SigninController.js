'use strict'

angular.module('acme_supermarket').registerCtrl('SigninCtrl', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
	$scope.loginFailed = false;
	if($rootScope.loginFailed){
		$scope.loginFailed = true;
	}

	if($rootScope.registerCompleted) {
		$scope.registerCompleted = true;
		$rootScope.registerCompleted = false;
	}
	// Function invoked by signin submit
	$scope.submitSignin = function() {
		$scope.loginFailed = false;
		$http.post('/api/signin', {
			email: $scope.email,
			password: $scope.password
		}).then(function success(response) {
			$rootScope.loginFailed = false;
			if(response.data.success == false) {
				$scope.loginFailed = true;
			} else {
				$window.location.href = '/home';
			}
		}, function error(response) {
			$rootScope.loginFailed = false;
			$scope.loginFailed = true;
		});
	}
	
}]);