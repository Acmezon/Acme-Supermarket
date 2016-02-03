'use strict'

angular.module('acme_supermarket').registerCtrl('DiscountListCtrl', ['$scope', '$http', 'ngTableParams', '$route', '$translate', 'ngToast', function ($scope, $http, ngTableParams, $route, $translate, ngToast) {

	$scope.discount = {};

	$http({
		method: 'GET',
		url: '/api/discounts'
	}).
	then(function success(response) {
		$scope.$data = response.data;

		$scope.$data.forEach(function (discount) {
			$http({
				method: 'GET',
				url: '/api/discounts/numberproducts/' + discount._id
			}).
			then(function success(response) {
				discount.numberOfProducts = response.data;
			});
		});
		
		$scope.tableParams = new ngTableParams({}, {dataset:$scope.$data});

		$scope.copy = angular.copy($scope.$data);

	});

	$scope.submit = function () {
		if(parseInt($scope.discount.value) < 0 || parseInt($scope.discount.value) > 100) {
			$translate(['Discounts.Error.Value']).then(function (translation) {
				ngToast.create({
					className: 'danger',
					content: translation['Discounts.Error.Value'],
					timeout: 10000
				});
			});
		} else {
			if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test($scope.discount.code)){
				$translate(['Discounts.Error.Code']).then(function (translation) {
					ngToast.create({
						className: 'danger',
						content: translation['Discounts.Error.Code'],
						timeout: 10000
					});
				});
			} else {
				$http({
					method: 'POST',
					url: '/api/discount/create',
					data: {
						code : $scope.discount.code,
						value: $scope.discount.value
					}
				}).
				then(function success(response) {
					$scope.discount = {};
					$route.reload();
				});
			}
		}
	}

	$scope.submitSignUp = function() {
		$http.post('/api/signup', $scope.customer)
		.then(function success(response) {
			$rootScope.registerCompleted = true;
			$window.location.href = '/signin';
		}, function error(response) {
			angular.forEach(response.data.message, function(error_msg) {
				var field = error_msg.key;
				$scope.signupForm[field].$setValidity("invalid", false);
			});
		});

		return false;
	}

	$scope.code = function () {
		$http({
			method: 'GET',
			url: '/api/generatecode'
		}).
		then(function success(response) {
			$scope.discount.code = response.data;
			$scope.validateCode();
		});
	}

	$scope.validateCode = function (){
		if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test($scope.discount.code)){
			$scope.createDiscountForm['code'].$invalid = true;
		}
	}


	$scope.edit = function (originalModel) {
		// Make a copy of discount being edited
		for (var i = 0; i < $scope.copy.length; i++) {
			if ($scope.copy[i]._id == originalModel._id) {
				originalModel.isEditing = true;
				$scope.copy[i] = angular.copy(originalModel);
				break;
			}
		}
	}

	$scope.save = function(discount, form) {
		var hasChanged = false;

		for (var i = 0; i < $scope.copy.length; i++) {
			if ($scope.copy[i]._id == discount._id) {
				hasChanged = $scope.copy[i].value != discount.value;
				break;
			}
		}

		// Will not query server until a discount has changed
		if (hasChanged) {
			$http.post('/api/discount',
				{
					discount_id: discount._id,
					value : discount.value
				}
			).
			then(function success(response) {
				// Make a copy
				for (var i = 0; i < $scope.copy.length; i++) {
					if ($scope.copy[i]._id == discount._id) {
						discount.isEditing = false;
						$scope.copy[i] = angular.copy(discount);
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

	$scope.delete = function(discount) {
		$http({ url: '/api/discount', 
			method: 'DELETE', 
			data: {id: discount._id}, 
			headers: {"Content-Type": "application/json;charset=utf-8"}
		}).then(function(res) {
			var i = $scope.$data.indexOf(discount)
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

	$scope.setValid = function (field) {
		$scope.createDiscountForm[field].$setValidity("invalid", true);
	}

}]);