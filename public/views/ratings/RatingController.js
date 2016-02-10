'use strict'

angular.module('acme_supermarket').registerCtrl('RatingCtrl', ['$scope', '$http', '$translate', 'ngToast', '$location', function ($scope, $http, $translate, ngToast, $location) {

	$scope.Math = Math;

	$scope.submit = function () {
		$http({
			method: 'GET',
			url: '/api/customer/byemail/' + $scope.email
		}).
		then(function success(response) {
			var customer = response.data;

			$http.post('/api/ratings/manage',
			{
				customer_id: customer._id,
				product_id: $scope.product_id,
				value: $scope.value
			}).then (function success (response) {
				$translate(['Management.RatingSuccess']).then(function (translation) {
					ngToast.create({
						className: 'success',
						content: translation['Management.RatingSuccess']
					});
				});
			}, function error (response) {
				$translate(['Management.RatingError']).then(function (translation) {
					ngToast.create({
						className: 'danger',
						content: translation['Management.RatingError']
					});
				});
			});
			$location.path('/'); 
		});
	};

}]);
