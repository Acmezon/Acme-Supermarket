'use strict'

angular.module('acme_supermarket').registerCtrl('SocialMediaRuleCreateCtrl', ['$scope', '$http', '$translate', 'ngToast', '$window', function ($scope, $http, $translate, ngToast, $window) {

	$scope.submit = function () {
		$http({
			method: 'POST',
			url: '/api/productrule/create',
			data: {
				rule: $scope.socialmediarule
			}
		}).
		then(function success(response) {
			$translate(['SocialMediaRules.Success.Remove']).then(function (translation) {
				ngToast.create({
					className: 'success',
					content: translation['SocialMediaRules.Success.Remove']
				});
			});
			$window.location.href = "/monitoringrules"
		}, function error (response) {
			$translate(['SocialMediaRules.Error.Remove']).then(function (translation) {
				ngToast.create({
					className: 'danger',
					content: translation['SocialMediaRules.Error.Remove']
				});
			});
		});
	};

}]);