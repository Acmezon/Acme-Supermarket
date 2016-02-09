'use strict'

angular.module('acme_supermarket').registerCtrl('SocialMediaRulesCtrl', ['$scope', '$http', 'ngTableParams', '$translate', 'ngToast', function ($scope, $http, ngTableParams, $translate, ngToast) {

	$http({
		method: 'GET',
		url: '/api/socialmediarules/'
	}).
	then(function success(response) {
		$scope.socialmediarules = response.data;

		$scope.tableParams = new ngTableParams(
			{ group: "_type" },
			{ dataset: $scope.socialmediarules , counts: []});

	});


	$scope.remove = function (socialmediarule) {
		$http.delete('/api/socialmediarules/delete/' + socialmediarule._id)
		.then(function success(response) {
			$translate(['SocialMediaRules.Success.Remove']).then(function (translation) {
				ngToast.create({
					className: 'success',
					content: translation['SocialMediaRules.Success.Remove']
				});
			});

			for (var i = 0; i < $scope.socialmediarules.length; i++) {
				var rule = $scope.socialmediarules[i];
				if (rule._id==socialmediarule._id) {
					$scope.socialmediarules.splice(i, 1);
					break;
				}
			}
			$scope.tableParams.reload();

		}, function error(response) {
			$translate(['SocialMediaRules.Error.Remove']).then(function (translation) {
				ngToast.create({
					className: 'danger',
					content: translation['SocialMediaRules.Error.Remove']
				});
			});
		});
	};

}]);
