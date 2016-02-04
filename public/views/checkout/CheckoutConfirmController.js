'use strict'

angular.module('acme_supermarket').registerCtrl('CheckoutConfirmCtrl', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {

	if ($location.path().split("/")[2]=='success') {
		$scope.success = true;
		$scope.state = 'Success';
		$scope.totalPrice = 0;

		// Purchase
		$http({
			method: 'GET',
			url: '/api/purchase/' + $routeParams.id
		}).
		then(function success(response) {
			$scope.purchase = response.data;
			

			$http({
				method: 'GET',
				url: '/api/purchaselines/bypurchase/' + $scope.purchase._id
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

						$scope.totalPrice += purchaseline.quantity * purchaseline.price;

						purchaseline.oldprice = provide.price;

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
		});


	} else {
		$scope.success = false;
		$scope.state = 'Error';
	}



}]);