'use strict'

angular.module('acme_supermarket').registerCtrl('SigninCtrl', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {

	$scope.loginFailed = false;
	$scope.loginFailedMessage = "";

	if($rootScope.loginFailed){
		$scope.loginFailed = true;
		$scope.loginFailedMessage = $rootScope.loginFailedMessage;
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
				$scope.loginFailedMessage = response.data.message;
			} else {
				$window.location.reload()
			}
		}, function error(response) {
			$rootScope.loginFailed = false;
			$scope.loginFailed = true;
		});
	}
	
}]);