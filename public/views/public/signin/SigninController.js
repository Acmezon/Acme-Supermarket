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
			if(response.data.success == false) {
				console.log(response.data);
				$scope.loginFailed = true;
				$scope.loginFailedMessage = response.data.message;
			} else {
				$window.location.href = '/home';
			}
		}, function error(response) {
			$scope.loginFailed = true;
		});
	}
	
}]);