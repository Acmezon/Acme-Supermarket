'use strict'

angular.module('acme_supermarket').registerCtrl('PurchasingRulesCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

	// Pagination
	$scope.currentPage = 0;
	$scope.pageSize = 10;
	// Ordering
	$scope.inverseOrder = false;
	$scope.sortBy = 'customer_id';
	// Filters
	$scope.customerFilter = '';
	// Inject Math
	$scope.Math = window.Math;
	

	// Refresh the page (order, filter and pagination)
	$scope.refreshPage = function(callback) {
		$http({
		method: 'POST',
		url: '/api/purchasingrules/filtered',
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
	};

	// Refresh the pages
	$scope.refreshCount = function(callback) {
		$http({
		method: 'POST',
		url: '/api/purchasingrules/filtered/count',
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
	};

	$scope.refresh = function () {
		$scope.refreshCount(function (number) {
			$scope.numberOfRules = number;
			if ($scope.currentPage > Math.ceil($scope.numberOfRules/parseInt($scope.pageSize))) {
				$scope.currentPage = 0;
				$scope.reload();
			}
			var list = [];
			for (var i = Math.max(0, $scope.currentPage-5); i < Math.min(Math.ceil($scope.numberOfRules/parseInt($scope.pageSize)), $scope.currentPage+6); i++) {
				list.push(i);
			}
			$scope.pages = list;
		});
	};

	$scope.reload = function() {
		$scope.refreshPage(function (rules) {
			$scope.purchasing_rules = rules;
			$scope.refresh();
		});
	};

	$scope.filter = function(value) {
		$scope.customerFilter = parseInt(value) || null;
		$scope.reload();
	}

	$scope.sort = function (order) {
		if (order=='customer_id' || order=='startDate' || order=='periodicity' || order=='product' || order=='quantity' || order=='nextRun') {
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
		if (page >= 0 && page < Math.ceil($scope.numberOfRules/parseInt($scope.pageSize))) {
			$scope.currentPage = page;
			$scope.reload();
		}
	}

	$scope.clearFilters = function() {
		$scope.customerFilter = '';
		$scope.reload();
	}

	$scope.remove = function(rule_id) {
		$http({ url: '/api/purchasingrule', 
					method: 'DELETE', 
					data: {id: rule_id}, 
					headers: {"Content-Type": "application/json;charset=utf-8"}
				}).
		then (function success(response) {
			for (var i = 0; i < $scope.purchasing_rules.length; i++) {
				if ($scope.purchasing_rules[i]._id == rule_id) {
					$scope.purchasing_rules.splice(i, 1);
				}
			}
		}, function error (error) {
			console.log(error.data);
		});

	}

	$scope.reload();
}]);