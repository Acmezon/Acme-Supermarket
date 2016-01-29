'use strict'

angular.module('acme_supermarket').registerCtrl('PurchaseDetailsCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {

	var _id = $routeParams.id;

	$scope.totalPrice = 0;

	$http({
		method: 'GET',
		url: '/api/purchase/' + _id
	}).
	then(function success(response) {
		$scope.purchase = response.data;
	}, function error (response) {
	});

	$http({
		method: 'GET',
		url: '/api/purchaselines/bypurchase/' + _id
	}).
	then(function success(response1) {
		// get purchase lines
		$scope.purchase_list = response1.data;

		$scope.purchase_list.forEach (function (purchaseline) {

			// for each purchaseline, get provide
			$http({
				method: 'GET',
				url: '/api/provide/' + purchaseline.provide_id
			}).
			then(function success(response2) {
				var provide = response2.data;

				// Add a field
				purchaseline.price = provide.price;

				// Calculate totalPrice
				$scope.totalPrice += purchaseline.price * purchaseline.quantity

				// Get supplier name
				$http({
					method: 'GET',
					url: '/api/supplierName/' + provide.supplier_id
				}).
				then(function success(response3) {
					var name = response3.data;
					purchaseline.supplierName = name;
				});

				// Get product
				$http({
					method: 'GET',
					url: '/api/product/' + provide.product_id
				}).
				then(function success(response3) {
					var product = response3.data;

					// Add fields
					purchaseline.product = product;
				});

			});
		
		});
	});

	


}]);