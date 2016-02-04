'use strict'

angular.module('acme_supermarket').registerCtrl('CheckoutCtrl', ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {
	
	var cookie = $cookies.get("shoppingcart");
	$scope.shoppingcart = [];
	if (cookie) {
		cookie = JSON.parse(cookie);
		if (!$.isEmptyObject(cookie)) {
			Object.keys(cookie).forEach(function(id) {

				$http({
					method: 'GET',
					url: '/api/existingProvide/' + id
				}).
				then(function success(response1) {
					var row = response1.data;
					// Get the quantity from cookie
					row.quantity = cookie[id];

					// Get the product of provide
					$http({
						method: 'GET',
						url: '/api/product/' + row.product_id
					}).
					then(function success(response2) {
						// Copy fields
						var product = response2.data;

						Object.keys(product).forEach(function (field) {
							if (field != "_id") {
								row[field] = product[field];
							}
						});

						// Get the supplier of provide
						$http({
							method: 'GET',
							url: '/api/supplierName/' + row.supplier_id
						}).
						then(function success(response3) {
							// Copy fields
							row.supplier = response3.data;

							// FINISH QUERYING
							// PUSH INTO SHOPPING CART
							$scope.shoppingcart.push(row)

						}, function error(response3) {
						});
					}, function error(response2) {
					});	
				}, function error(response1) {
				});
			});
		}
	}

	// Get my credit card
	$http({
		method: 'GET',
		url: '/api/mycreditcard'
	}).
	then(function success(response) {
		$scope.creditcard = response.data;
	    if ($scope.creditcard) {
	        $scope.typecc = typeOfCreditCard(response.data.number)
	        var number = hideCreditCard(response.data.number);
			$scope.creditcard.number = number;
	    }	
	}, function error(response) {
	});

	// Get my address
	$http({
		method: 'GET',
		url: '/api/myprofile'
	}).
	then(function success(response) {
		$scope.customer = response.data;
	}, function error(response) {
	});

	// PURCHASE BUTTON

	$scope.purchase = function(billingmethod) {
		if (billingmethod==1 || billingmethod==2 || billingmethod==3) {
			if ($scope.creditcard) {
				var cookie = $cookies.get("shoppingcart");
				// First cookie checks
				if (cookie) {
					cookie = JSON.parse(cookie);
					if (!$.isEmptyObject(cookie)) {
						// Purchase
						$http({
							method: 'POST',
							url: '/api/purchase/process',
							data: {
								billingMethod : billingmethod,
								discountCode : $scope.discount ? $scope.discount.code : null
							}
						}).
						then(function success(response) {
							var purchase = response.data;
							var cookie = $cookies.remove("shoppingcart");
							$window.location.href = '/checkout/success/' + purchase._id;
						}, function error(response) {
							$window.location.href = '/checkout/error';
						});
					}
				}
			}
		}
	}

	// CREDIT CARDS

	var hideCreditCard = function(number) {
		for (var i = 0; i < number.length - 4; i++) {
			number = setCharAt(number, i, '*')
		}
		return number
	}

	var setCharAt = function(str,index,chr) {
    	if(index > str.length-1) return str;
    	return str.substr(0,index) + chr + str.substr(index+1);
	}

	var typeOfCreditCard = function(ccnumber) {
		ccnumber = ccnumber.toString().replace(/\s+/g, '');
		var cardType = "-----"
    	if(/^3[47][0-9]{13}$/.test(ccnumber)) {
    		cardType = "American Express";
		}
		if(/^(62)|^(88)/.test(ccnumber)) {
			cardType = "China UnionPay";
		}
		if(/^30[0-5]/.test(ccnumber)) {
			cardType = "Diners Club Carte Blanche";
		}
		if(/^(2014)|^(2149)/.test(ccnumber)) {
			cardType = "Diners Club enRoute";
		}
		if(/^3(?:0[0-5]|[68][0-9])[0-9]{11}$ /.test(ccnumber)) {
			cardType = "Diners Club International";
		}
		if(/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(ccnumber)) {
			cardType = "Discover Card";
		}
		if(/^(?:2131|1800|35\d{3})\d{11}$/.test(ccnumber)) {
			cardType = "JCB";
		}
		if(/^(6304)|^(6706)|^(6771)|^(6709)/.test(ccnumber)) {
			cardType = "Laser";
		}
		if(/^(5018)|^(5020)|^(5038)|^(5893)|^(6304)|^(6759)|^(6761)|^(6762)|^(6763)|^(0604)/.test(ccnumber)) {
			cardType = "Maestro";
		}
		if(/^5[1-5][0-9]{14}$/.test(ccnumber)) {
			cardType = "MasterCard";
		}
		if (/^4/.test(ccnumber)) {
			cardType = "Visa"
		}
		if (/^(4026)|^(417500)|^(4405)|^(4508)|^(4844)|^(4913)|^(4917)/.test(ccnumber)) {
			cardType = "Visa Electron"
		}
		return cardType
	}

	// SHOPPING CART

	$scope.productsInCart = function() {
		var r = 0;
		var cookie = $cookies.get("shoppingcart");
		if (cookie) {
			cookie = JSON.parse(cookie);
			if (!$.isEmptyObject(cookie)) {
				for (var id in cookie) {
					if (cookie.hasOwnProperty(id)) {
						r += cookie[id];
					}
				}
			}
		}
		return r;
	}

	$scope.hasEmptyCart = function () {
		return $scope.productsInCart()===0;
	}

	$scope.totalPrice = function(shoppingcart) {
		var r = 0;
		var quantity;
		var cookie = $cookies.get("shoppingcart");
		if (cookie) {
			cookie = JSON.parse(cookie);
			if (!$.isEmptyObject(cookie)) {
				for (var i = 0; i < shoppingcart.length; i++) {
					quantity = cookie[shoppingcart[i]._id];

					if ($scope.discount && $scope.discountRedeemed) {
						r += quantity * (shoppingcart[i].price * ($scope.discount.value/100));
					} else {
						r += quantity * shoppingcart[i].price;
					}
				}
			}
		}
		return r;
	}

	// DISCOUNT CODES

	$scope.applyDiscount = function (discountCode) {
		if (discountCode) {
			if(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(discountCode)) {

				$scope.discountRedeemed = false;

				$scope.shoppingcart.forEach( function (provide) {
					$http({
						method: 'POST',
						url: '/api/discount/canredeem/',
						data: {
							code: discountCode,
							product_id: provide.product_id
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
}]);