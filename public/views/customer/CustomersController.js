'use strict'

angular.module('acme_supermarket').registerCtrl('CustomersCtrl', ['$scope', '$http', 'ngTableParams', '$route', function ($scope, $http, ngTableParams, $route) {
	
	$http({
		method: 'GET',
		url: '/api/customers'
	}).
	then(function success(response) {
		$scope.$data = response.data;
		
		$scope.tableParams = new ngTableParams({}, {dataset:$scope.$data});
		$scope.copy = angular.copy($scope.$data);
		
	}, function error(response) {
	});
	
	$scope.edit = function (originalModel) {
		// Make a copy of customer being edited
		for (var i = 0; i < $scope.copy.length; i++) {
			if ($scope.copy[i]._id == originalModel._id) {
				originalModel.isEditing = true;
				$scope.copy[i] = angular.copy(originalModel);
				break;
			}
		}
	}

	$scope.save = function(customer, form) {
		var hasChanged = false;

		for (var i = 0; i < $scope.copy.length; i++) {
			if ($scope.copy[i]._id == customer._id) {
				hasChanged = $scope.copy[i].name != customer.name || $scope.copy[i].surname != customer.surname 
				|| $scope.copy[i].email != customer.email || $scope.copy[i].address != customer.address 
				|| $scope.copy[i].country != customer.country || $scope.copy[i].city != customer.city 
				|| $scope.copy[i].phone != customer.phone;
				break;
			}
		}

		// Will not query server until a customer has changed
		if (hasChanged) {
			$http({
				method: 'POST',
				url: '/api/customer',
				data: customer
			}).
			then(function success(response) {
				// Make a copy
				for (var i = 0; i < $scope.copy.length; i++) {
					if ($scope.copy[i]._id == customer._id) {
						customer.isEditing = false;
						$scope.copy[i] = angular.copy(customer);
						form.$setPristine();
						break;
					}
				}
			}, function error(response) {
			});
		}
	};

	$scope.cancel = function (originalModel, form) {
		// Restore the backup
		for (var i = 0; i < $scope.copy.length; i++) {
			if ($scope.copy[i]._id == originalModel._id) {
				$scope.copy[i].isEditing = false;
				// Copy fields. Copying the whole object does not work.
				Object.keys($scope.copy[i]).forEach ( function (key) {
					originalModel[key] = $scope.copy[i][key];
				});
				break;
			}
		}
		form.$setPristine();
	};

	$scope.delete = function(customer) {
		$http({ url: '/api/customer', 
			method: 'DELETE', 
			data: {id: customer._id}, 
			headers: {"Content-Type": "application/json;charset=utf-8"}
		}).then(function(res) {
			var i = $scope.$data.indexOf(customer)
			if(i != -1) {
				$scope.$data.splice(i, 1);
				$scope.copy.splice(i, 1);
			}
			$scope.tableParams.reload()
		}, function(error) {
			console.log(error);
		});
	};

	$scope.refresh = function() {
		$route.reload();
	}


}]);