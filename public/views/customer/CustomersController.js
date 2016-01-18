'use strict'

angular.module('acme_supermarket').registerCtrl('CustomersCtrl', ['$scope', '$http', 'ngTableParams', '$route', function ($scope, $http, ngTableParams, $route) {

	$http({
		method: 'GET',
		url: '/api/customers'
	}).
	then(function success(response) {
		$scope.$data = response.data;

		// Get credit cards of each customer
		$scope.$data.forEach(function (customer) {
			
			$http({
				method: 'GET',
				url: '/api/creditcard/' + customer.credit_card_id
			}).
			then(function success(response2) {
				// Paste credit card info

				var creditcard = response2.data;
				customer.creditcard = creditcard;
				
			}, function error(response2) {
			});
		});
		
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
		// close pop up
		var modalInstance = $('#delete-'+customer._id);
		modalInstance.modal('hide');

		// Aftter 200ms modal closed, delete from db
		setTimeout(
   			function() {
				$http({ url: '/api/customer/delete', 
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
		        	alert(error)
		            console.log(error);
		        });
    		}, 200);
    };

    $scope.refresh = function() {
    	$route.reload();
    }


}]);
