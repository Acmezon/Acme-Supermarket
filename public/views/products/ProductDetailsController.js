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
		$scope.value = $scope.product.avgRating;

		$scope.out_suppliers = [];

		// Get provides from product
		$http({
			method: 'GET',
			url: '/api/providesByProductId/' + $scope.product._id
		}).
		then (function success (res_provides) {
			var provides = res_provides.data;

			// PUT INTO OUTPUT VARIABLE
			$http({
				method: 'GET',
				url: '/api/getUserRole'
			}).
			then(function success(role) {
				$scope.role = role.data;

				if ($scope.role=='supplier') {
					$http({
						method: 'GET',
						url: '/api/provide/bysupplier/byproduct/' + $scope.product._id
					}).
					then(function success(prov) {
						var provide = prov.data;
						if (provide) {
							$http({
								method: 'GET',
								url: '/api/reputations/byprovide/' + provide._id
							}).
							then(function success(reps) {
								var reputations = reps.data.reputations;
								console.log(reputations)
								if (reputations.length) {
									$scope.avgRating = reps.data.avgRating;
									var count1 = 0,
										count2 = 0,
										count3 = 0,
										count4 = 0,
										count5 = 0;
									$scope.reputationslength = reputations.length;
									reputations.forEach(function (reputation) {
										if (reputation.value==1) {
											count1++;
										} else {
											if (reputation.value==2){
												count2++;
											} else {
												if (reputation.value==3){
													count3++;
												} else {
													if(reputation.value==4) {
														count4++;
													} else {
														if (reputation.value==5) {
															count5++;
														}
													}
												}
											}
										}
									});
									var ratingdata = [
										{rating: 1, quantity: count1},
										{rating: 2, quantity: count2},
										{rating: 3, quantity: count3},
										{rating: 4, quantity: count4},
										{rating: 5, quantity: count5}
									];
									var h = 1000;
									var r = h/2;
									var arc = d3.svg.arc().outerRadius(r);
									var colors = [
									    'rgb(135,203,219)',
									    'rgb(96,186,208)',
									    'rgb(76,177,202)',
									    'rgb(52,151,175)',
									    'rgb(46,134,155)'
									];
									nv.addGraph(function() {
									    var chart = nv.models.pieChart()
									        .x(function(d) { return d.rating })
									        .y(function(d) { return d.quantity })
									        .color(colors)
									        .showLabels(true)
									        .labelType("percent")
											//.donut(true).donutRatio(5) /* Trick to make the labels go inside the chart*/
									    ;
									    
									    d3.select("#chart svg")
									        .datum(ratingdata)
									        .transition().duration(1200)
									        .call(chart)
									    ;

									    d3.selectAll(".nv-label text")
									        /* Alter SVG attribute (not CSS attributes) */
									        .attr("transform", function(d){
									            d.innerRadius = -450;
									            d.outerRadius = r;
									            return "translate(" + arc.centroid(d) + ")";}
									        )
									        .attr("text-anchor", "middle")
									        /* Alter CSS attributes */
									        .style({"font-size": "1em"})
									    ;
									    
									    /* Replace bullets with blocks */
									    d3.selectAll('.nv-series').each(function(d,i) {
									        var group = d3.select(this),
									            circle = group.select('circle');
									        var color = circle.style('fill');
									        circle.remove();
									        var symbol = group.append('path')
									            .attr('d', d3.svg.symbol().type('square'))
									            .style('stroke', color)
									            .style('fill', color)
									            // ADJUST SIZE AND POSITION
									            .attr('transform', 'scale(1.5) translate(-2,0)')
									    });

									        
									    return chart;
									});

								}
								//console.log($scope.reputations)
							});
						}
					});
				}
			}, function error(role) {
			});

			$scope.out_suppliers = provides;

		}, function error (res_provides) {
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
			rating: $scope.value
		}).then(
		function success(response) {},
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

	$http.get('/api/myRecommendations').then(function success(products) {
		$http.post('/api/product/getByIdList', { products : products}).then(
			function success(product_list) {
				$scope.recommendedProducts = product_list.data;
			}, function error(response){});
	}, function error(response) {});

	$scope.rateProvide = function(provide_id, value) {
		$http.post('/api/provide/updateProvideRating',
		{
			provide_id: provide_id,
			rating: value
		}).then(
		function success(response) {},
		function error(response) {
			switch(response.status) {
				case 403:
					$rootScope.loginFailed = true;
					$location.url('/signin');
					break;
				case 401:
					$translate(['Product.RatingProvidePurchaseError']).then(function (translation) {
						ngToast.create({
							className: 'warning',
							content: translation['Product.RatingProvidePurchaseError']
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

	$scope.setPriceValid = function () {
		$scope.provideProductForm.price.$setValidity("invalid", true);
	};

	$scope.submitProvideProduct = function () {
		if($scope.new_provide.price <= 0.0) {
			$scope.provideProductForm.price.$setValidity("invalid", false);
			return false;
		}

		$http.post('/api/supplier/provideProduct',
		{
			product_id : id,
			price : $scope.new_provide.price
		}).then(function success(response) {
			$window.location.reload();
		}, function error (response) {
			$translate(['Product.ProvideError']).then(function (translation) {
				ngToast.create({
					className: 'danger',
					content: translation['Product.ProvideError']
				});
			});
		});
	};

	$scope.supplierProvides = true;

	$http.post('/api/supplier/checkProvides',
	{
		product_id: id
	}).then(function success(response) {
		$scope.supplierProvides = response.data.provides;
	}, function error(response) {
		$scope.supplierProvides = false;
	});

	// Supplier deletes a provide
	$scope.deleteProvide = function (){
		$http({
			method: 'GET',
			url: '/api/provide/bysupplier/byproduct/delete/' + id
		}).
		then(function success(response) {
			$window.location.reload();
		}, function error (response) {
			$translate(['Product.DeleteError']).then(function (translation) {
				ngToast.create({
					className: 'error',
					content: translation['Product.DeleteError']
				});
			});
		});		
	}


}]);