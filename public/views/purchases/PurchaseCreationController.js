'use strict'

angular.module('acme_supermarket').registerCtrl('PurchaseCreationCtrl', ['$scope', '$http', '$translate', 'ngToast', '$window', function ($scope, $http, $translate, ngToast, $window) {

	$scope.shoppingcart = [];
	$scope.product_id = 1;
	$scope.Math = Math;

	$scope.load = function (product_id) {
		// Get provides from product
		$http({
			method: 'GET',
			url: '/api/providesByProductId/' + product_id
		}).
		then (function success (response) {
			$scope.provides = response.data;
			$scope.isEditing = true;
		})
	}

	$scope.addToCart = function (provide) {
		// Get the product of provide
		$http({
			method: 'GET',
			url: '/api/product/' + provide.product_id
		}).
		then (function success (response) {
			console.log(response)
			var product = response.data;
			product.provide_id = provide._id;
			product.price = provide.price;
			product.supplierName = provide.supplierName;

			var index = productInCart(product._id);
			if (index>-1) {
				product.quantity = $scope.shoppingcart[index].quantity+1;
				$scope.shoppingcart[index] = product;
			} else {
				product.quantity = 1;
				$scope.shoppingcart.push(product);
			}
			console.log($scope.shoppingcart)
			$scope.isEditing = false;

		});
		
	}

	$scope.add = function (product) {
		product.quantity = Math.min(999, product.quantity+1)
	}

	$scope.substract = function (product) {
		product.quantity = Math.max(1, product.quantity-1)
	}

	$scope.remove = function (product) {
		var i = productInCart(product._id)
		$scope.shoppingcart.splice(i, 1);
	}

	$scope.check = function (customerEmail) {
		console.log(customerEmail)
		$http({
			method: 'GET',
			url: '/api/customer/byemail/' + customerEmail
		}).
		then (function success (response) {
			$scope.customer = response.data;
			if (!$scope.customer) {
				$translate(['Customers.NotFound']).then(function (translation) {
					ngToast.create({
						className: 'danger',
						content: translation['Customers.NotFound']
					});
				});
			} else {
				if (!$scope.customer.credit_card_id){
					$translate(['Customers.CreditCardNotFound']).then(function (translation) {
						ngToast.create({
							className: 'danger',
							content: translation['Customers.CreditCardNotFound']
						});
					});
				}
			}
		});
	}

	$scope.submit = function () {

		var shoppingcart = {};
		$scope.shoppingcart.forEach(function (product) {
			shoppingcart[product.provide_id] = product.quantity;
		});

		$http({
			method: 'POST',
			url: '/api/purchase/admin',
			data : {
				billingMethod : $scope.billingMethod,
				customer_id: $scope.customer._id,
				shoppingcart : shoppingcart,
				discountCode : $scope.discount ? $scope.discount.code : null
			}
		}).
		then(function success(response) {
			var purchase = response.data;
			$window.location.href = '/checkout/success/' + purchase._id;
		}, function error(response) {
			$window.location.href = '/checkout/error';
		});

	}

	var provideIncart = function (provide_id) {
		var r = -1;
		for (var i = 0; i < $scope.shoppingcart.length; i++) {
			if ($scope.shoppingcart[i].provide_id==provide_id) {
				r = i;
				break;
			}
		}
		return r;
	}

	var productInCart = function (product_id) {
		var r = -1;
		for (var i = 0; i < $scope.shoppingcart.length; i++) {
			if ($scope.shoppingcart[i]._id==product_id) {
				r = i;
				break;
			}
		}
		return r;
	}

	// DISCOUNT CODES

	$scope.applyDiscount = function (discountCode) {
		if (discountCode) {
			if(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(discountCode)) {

				$scope.discountRedeemed = false;

				$scope.shoppingcart.forEach( function (product) {
					$http({
						method: 'POST',
						url: '/api/discount/canredeem/',
						data: {
							code: discountCode,
							product_id: product._id
						}
					}).
					then(function success(response) {
						var discount = response.data;
						if (discount) {
							$scope.discountRedeemed = true;
							$scope.discount = discount;
						}
					});
				});
				
			} else {
				$scope.discountRedeemed = false;
			}
		} else {
			$scope.discountRedeemed = false;
		}
	}

}])