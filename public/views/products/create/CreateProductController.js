'use strict'

angular.module('acme_supermarket').registerCtrl('CreateProductCtrl', ['$scope', '$http', '$translate', '$window', 'Upload',
function ($scope, $http, $translate, $window, Upload) {
	$scope.submitCreateProduct = function() {
		Upload.upload({
			url: '/api/products/create',
			method: 'POST',
			data: {
				'name': $scope.product.name,
				'description' : $scope.product.description
			},
			file: $scope.product.image
		}).then(function success (resp) {
			$window.location.href = '/products';
		}, function error (resp) {
			console.log('Error status: ' + resp.status);
		});
	};
}]);