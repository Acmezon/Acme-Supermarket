'use strict'

angular.module('acme_supermarket').registerCtrl('ProductDetailsCtrl', ['$scope', '$http', '$routeParams', '$translate', '$window', 'ngToast', '$cookies', '$cookieStore', '$location' , '$rootScope', 
function ($scope, $http, $routeParams, $translate, $window, ngToast, $cookies, $cookieStore, $location, $rootScope) {
	var id = $routeParams.id;

	$http({
		method: 'GET',
		url: '/api/product/' + id
	}).
	then(function success(response) {
		$scope.product = response.data;
		$scope.rate = response.data.rating

		$scope.out_suppliers = [];

		// Get provides from product
		$http({
			method: 'GET',
			url: '/api/providesByProductId/' + $scope.product._id
		}).
		then (function success (response2) {
			var provides = response2.data;

			var minMax = minMaxPrices(provides);
			$scope.product.minPrice = minMax[0];
			$scope.product.maxPrice = minMax[1]; 

			provides.forEach(function(provide) {

				// Get supplier of each provide
				$http({
					method: 'GET',
					url: '/api/supplierName/' + provide.supplier_id
				}).
				then (function success (response3) {
					var supplierName = response3.data;
					provide.supplierName = supplierName;
				}, function error (response3){
				});

				// Get average reputation of supplier
				$http({
					method: 'GET',
					url: '/api/averageReputationBySupplierId/' + provide.supplier_id
				}).
				then (function success (response3) {
					var avgreputation = response3.data;
					provide.reputation = avgreputation;
				}, function error(response3) {
				});

			});

			// FINISH PROCESS
			// PUT INTO OUTPUT VARIABLE
			$scope.out_suppliers = provides;
			console.log($scope.out_suppliers)

		}, function error (response2) {
		});


	}, function error(response) {
	});

	$scope.userHasPurchased = false;

	$http.post('/api/product/userHasPurchased', {
		product: id
	}).then(
		function success(response) {
			$scope.userHasPurchased = response.data.hasPurchased;
		}, function error(response) {
			$scope.userHasPurchased = false;
		}
	);

	//Hides Dropzone
	$("form#upload-img-form").hide();
	var dropzoned = false;

	//Dropzone configuration
	Dropzone.autoDiscover = false;
	Dropzone.options.uploadImgForm = {
		paramName: "file",
	}

	//Toggles edition and initializes Dropzone if it isn't yet.
	$scope.toggleEdition = function() {
		$scope.textNameForm.$show();
		$scope.textPriceForm.$show();
		$scope.textDescForm.$show();

		if(!dropzoned) {
			$translate(['Product.Upload']).then(function (translation) {
				var imgDropzone = new Dropzone("form#upload-img-form", 
				{ 
					acceptedFiles: "image/*",
					uploadMultiple: false,
					maxFiles: 1
				});

				imgDropzone.on('sending', function(file, xhr, formData){
					formData.append('p_id', id);
				});

				imgDropzone.on('complete', function(){
					$window.location.reload();
				});

				$("form#upload-img-form").html(translation['Product.Upload'])

				$("form#upload-img-form").show();

				dropzoned = true;
			});
		} else {
			$("form#upload-img-form").show();
		}
		
	}

	//If is something Editable the "Edit" button is hidden
	$scope.isSomethingEditable = function() {
		return  $scope.textNameForm.$visible ||
				$scope.textPriceForm.$visible ||
				$scope.textDescForm.$visible;
	}

	//Sends the server the product edition request
	$scope.updateProduct = function(field, data) {
		return $http.post('/api/product/updateProduct',
			{
				id: id,
				field: field,
				data: data
			});
	}

	//Hides the Dropzone if the user clicks outside it
	$(document).on('click', function (event) {
		if (!$(event.target).closest('form#upload-img-form').length && 
			!$(event.target).closest('#btn-edit').length &&
			!$(event.target).closest('input.dz-hidden-input').length) {
			$("form#upload-img-form").hide();
		}
	});

	//Sets the maximun rating 
	$scope.max = 5; 
	//Watches the "rate" and when it changes, submit the new rating to the server
	$scope.rateProduct = function () {
		$http.post('/api/product/updateProductRating',
		{
			id: id,
			rating: $scope.rate
		}).then(function success(response) {},
				function error(response) {
					switch(response.status) {
						case 403:
							$rootScope.loginFailed = true;
							$location.url('/signin');
							break;
						case 401:
							$translate(['Product.RatingPurchaseError']).then(function (translation) {
								ngToast.create({
									className: 'warning',
									content: translation['Product.RatingPurchaseError']
								});
							});
							break;
						default:
							$translate(['Product.RatingError']).then(function (translation) {
								ngToast.create({
									className: 'danger',
									content: translation['Product.RatingError']
								});
							});
							break;
					}
				});
	};

	$scope.addToCart = function (provide_id) {
		console.log(provide_id)
		var cookie = $cookies.get("shoppingcart");
		var new_cookie = {};
		if (!cookie) {
			new_cookie[provide_id] = 1;
		} else {
			cookie = JSON.parse(cookie);
			new_cookie = cookie;
			if ($.isEmptyObject(cookie)) {
				new_cookie[provide_id] = 1;
				$cookieStore.put("shoppingcart", new_cookie);
			} else {
				if (new_cookie[provide_id]) {
					new_cookie[provide_id] = cookie[provide_id] + 1;
				} else {
					new_cookie[provide_id] = 1;
				}
			}
		}
		$cookieStore.put("shoppingcart", new_cookie);
	}

	var minMaxPrices = function (provides) {
		var lowest = Number.POSITIVE_INFINITY;
		var highest = Number.NEGATIVE_INFINITY;
		var tmp;
		for (var i = provides.length - 1; i >= 0; i--) {
		    tmp = provides[i].price;
		    if (tmp < lowest) lowest = tmp;
		    if (tmp > highest) highest = tmp;
		}
		return [lowest, highest];
	}
}]);