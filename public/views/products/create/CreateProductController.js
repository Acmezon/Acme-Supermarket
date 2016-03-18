'use strict'

angular.module('acme_supermarket').registerCtrl('CreateProductCtrl', ['$scope', '$http', '$translate', '$window', 'Upload',
function ($scope, $http, $translate, $window, Upload) {
	$scope.submitCreateProduct = function() {
		Upload.upload({
			url: '/api/products/create',
			method: 'POST',
			data: {
				'name': $scope.name,
				'description' : $scope.description,
				'code' : $scope.code
			},
			file: $scope.image
		}).then(function success (resp) {
			$window.location.href = '/products';
		}, function error (resp) {
			console.log('Error status: ' + resp.status);
		});
	};

	$scope.checkCode = function(productCode) {
		if (productCode.length==13 && /^0|[1-9]\d*$/.test(productCode)) {
			$http({
				method: 'GET',
				url: '/api/products/checkcode/' + productCode
			}).
			then(function success(response) {
				$scope.checkedCode = response.data
			}, function error (response) {
			});
		} else {
			$scope.checkedCode = false
		}
	};
}]);