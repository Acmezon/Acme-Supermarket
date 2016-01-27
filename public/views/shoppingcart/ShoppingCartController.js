'use strict'

angular.module('acme_supermarket').registerCtrl('ShoppingCartCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$window', function ($scope, $http, $cookies, $cookieStore, $window) {
	
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
		return $scope.productsInCart()==0;
	}

	$scope.add = function(product) {
		product.quantity = Math.min(product.quantity + 1, 999);
		var id = product._id;
		// Updates in table
		var index = -1;		
		var products = eval( $scope.shoppingcart );
		for( var i = 0; i < products.length; i++ ) {
			if( products[i].id == id ) {
				products[i].quantity = products[i].quantity + 1
			}
		}
		// Updates in cookie
		var cookie = $cookies.get("shoppingcart");
		var new_cookie = {};
		if (cookie) {
			cookie = JSON.parse(cookie);
			new_cookie = cookie;
			if (!$.isEmptyObject(cookie)) {
				if (new_cookie[id]) {
					new_cookie[id] = Math.min(cookie[id] + 1, 999);
				}
			}
		$cookieStore.put("shoppingcart", new_cookie);
		}
	}

	$scope.substract = function(product) {
		product.quantity = Math.max(product.quantity - 1, 1);
		var id=product._id;
		// Updates in table
		var index = -1;		
		var products = eval( $scope.shoppingcart );
		for( var i = 0; i < products.length; i++ ) {
			if( products[i].id == id ) {
				products[i].quantity = products[i].quantity - 1
			}
		}
		// Updates in cookie
		var cookie = $cookies.get("shoppingcart");
		var new_cookie = {};
		if (cookie) {
			cookie = JSON.parse(cookie);
			new_cookie = cookie;
			if (!$.isEmptyObject(cookie)) {
				if (new_cookie[id]) {
					new_cookie[id] = Math.max(cookie[id] - 1, 1);
				}
			}
		$cookieStore.put("shoppingcart", new_cookie);
		}
	}


	$scope.remove = function (product_id) {
		console.log("To be removed "+product_id)
		var cookie = $cookies.get("shoppingcart");
		if (cookie) {
			cookie = JSON.parse(cookie);
			console.log(cookie)
			if (!$.isEmptyObject(cookie)) {
				for (var id in cookie) {
					if (cookie.hasOwnProperty(id)) {
						console.log("Removing " + id)
						if (id==product_id) {
							delete cookie[id];
						}
					}
				}
			}
		}
		for (var i = 0; i<$scope.shoppingcart.length; i++) {
			if ($scope.shoppingcart[i]._id == product_id) {
				$scope.shoppingcart.splice(i, 1);
			}
		}
		$cookieStore.put("shoppingcart", cookie);
	}

	$scope.return = function() {
		$window.history.back();
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
					r += quantity * shoppingcart[i].price;
				}
			}
		}
		return r;
	}
}]);