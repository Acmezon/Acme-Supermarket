'use strict'

angular.module('acme_supermarket').registerCtrl('BarcodeCtrl', ['$scope', '$http', '$translate', '$window', 'Upload',
function ($scope, $http, $translate, $window, Upload) {
	$scope.scanBarcode = function() {
		$http.post('/api/barcode/',
			{
				image: $scope.barcode
		}).then(function success (resp) {
			console.log('success status: ' + resp.status);
		}, function error (resp) {
			console.log('Error status: ' + resp.status);
		});
	};
}]);