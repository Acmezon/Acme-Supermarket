'use strict'

angular.module('acme_supermarket').registerCtrl('PurchasesListCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

	// Pagination
	$scope.currentPage = 0;
	$scope.pageSize = 20;
	// Ordering
	$scope.inverseOrder = false;
	$scope.sortBy = 'paymentDate';
	// Filters
	$scope.customerFilter = '';
	// Inject Math
	$scope.Math = window.Math;
	
	$scope.view = $location.path().split("/")[1];

	// Refresh the page (order, filter and pagination)
	$scope.refreshPage = function(callback) {

		if ($scope.view=='mypurchases') {

			$http({
				method: 'POST',
				url: '/api/purchases/mypurchases/filtered',
				data: {
					currentPage : $scope.currentPage,
					pageSize : $scope.pageSize,
					sort : $scope.sortBy,
					order : $scope.inverseOrder ? -1 : 1,
				}
			}).
			then(function success(response) {
				callback(response.data);
				return;
			});

		} else {

			$http({
			method: 'POST',
			url: '/api/purchases/filtered',
			data: {
				currentPage : $scope.currentPage,
				pageSize : $scope.pageSize,
				sort : $scope.sortBy,
				order : $scope.inverseOrder ? -1 : 1,
				customerFilter : $scope.customerFilter
			}
			}).
			then(function success(response) {
				callback(response.data);
				return;
			});

		}
	};

	// Refresh the pages
	$scope.refreshCount = function(callback) {

		if ($scope.view=='mypurchases') {

			$http({
			method: 'POST',
			url: '/api/purchases/mypurchases/filtered/count',
			data : {
				currentPage : $scope.currentPage,
				pageSize : $scope.pageSize,
				sort : $scope.sortBy,
				order : $scope.inverseOrder ? -1 : 1,
			}
			}).
			then(function success(response) {
				callback(response.data);
				return;
			});

		} else {

			$http({
			method: 'POST',
			url: '/api/purchases/filtered/count',
			data : {
				currentPage : $scope.currentPage,
				pageSize : $scope.pageSize,
				sort : $scope.sortBy,
				order : $scope.inverseOrder ? -1 : 1,
				customerFilter : $scope.customerFilter
			}
			}).
			then(function success(response) {
				callback(response.data);
				return;
			});

		}
	};

	$scope.refresh = function () {
		$scope.refreshCount(function (number) {
			$scope.numberOfPurchases = number;
			if ($scope.currentPage > Math.ceil($scope.numberOfPurchases/parseInt($scope.pageSize))) {
				$scope.currentPage = 0;
				$scope.reload();
			}
			var list = [];
			for (var i = Math.max(0, $scope.currentPage-5); i < Math.min(Math.ceil($scope.numberOfPurchases/parseInt($scope.pageSize)), $scope.currentPage+6); i++) {
				list.push(i);
			}
			$scope.pages = list;
		});
	};

	$scope.reload = function() {
		$scope.refreshPage(function (purchases) {
			$scope.purchases = purchases;
			$scope.refresh();
		});
	};

	$scope.filter = function(value) {
		$scope.customerFilter = parseInt(value) || null;
		$scope.reload();
	}

	$scope.sort = function (order) {
		if (order=='customer_id' || order=='paymentDate' || order=='deliveryDate') {
			if ($scope.sortBy == order) {
				$scope.inverseOrder = !$scope.inverseOrder;
			} else {
				$scope.sortBy = order;
			}
			$scope.reload();
		}
	}

	$scope.loadPage = function (page) {
		var page = parseInt(page) || 0;
		if (page >= 0 && page < Math.ceil($scope.numberOfPurchases/parseInt($scope.pageSize))) {
			$scope.currentPage = page;
			$scope.reload();
		}
	}

	$scope.clearFilters = function() {
		$scope.customerFilter = '';
		$scope.reload();
	}

	$scope.remove = function(purchase_id) {
		$http({ url: '/api/purchase', 
					method: 'DELETE', 
					data: {id: purchase_id}, 
					headers: {"Content-Type": "application/json;charset=utf-8"}
				}).then (function success(response) {
					for (var i = 0; i < $scope.purchases.length; i++) {
						if ($scope.purchases[i]._id == purchase_id) {
							$scope.purchases.splice(i, 1);
						}
					}
				}, function error (error) {
					console.log(error.data);
		});

	}

	$scope.reload();


}]);