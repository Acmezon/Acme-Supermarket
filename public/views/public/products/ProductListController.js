'use strict'

angular.module('acme_supermarket').registerCtrl('ProductListCtrl', ['$scope', '$http', function ($scope, $http) {
	
	$http({
		method: 'GET',
		url: '/api/products'
	}).
	then(function success(response1) {
		$scope.products = response1.data;
		$scope.products.forEach(function(product) {
    		$http({
				method: 'GET',
				url: '/api/providesByProductId/' + product._id
			}).
			then(function success(response2) {
				var provides = response2.data;
				var minMax = minMaxPrices(provides);
				product.minPrice = minMax[0];
				product.maxPrice = minMax[1]; 
			}, function error (response2) {
			});

			$http({
				method: 'GET',
				url: '/api/averageRatingByProductId/' + product._id
			}).
			then(function success(response2) {
				product.rating = response2.data;
			}, function error (response2) {
			});
		});

	}, function error(response1) {
	});

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


	// Orderings

	$scope.inverseOrder = false;
	$scope.sortProductsBy = 'name';

	$scope.invertOrder = function(sortProductsBy) {
		$scope.inverseOrder = !$scope.inverseOrder;
	};

	$scope.normalOrInverse = function(sortProductsBy) {
		var r;
		if ($scope.inverseOrder) {
			r = '-'.concat($scope.sortProductsBy);
			// Method to make image rotate
			$('.v-middle').css({
		        '-webkit-transform': 'rotate(' + 180 + 'deg)',  //Safari 3.1+, Chrome  
		        '-moz-transform': 'rotate(' + 180 + 'deg)',     //Firefox 3.5-15  
		        '-ms-transform': 'rotate(' + 180 + 'deg)',      //IE9+  
		        '-o-transform': 'rotate(' + 180 + 'deg)',       //Opera 10.5-12.00  
		        'transform': 'rotate(' + 180 + 'deg)'          //Firefox 16+, Opera 12.50+  

		    });
		} else {
			r = $scope.sortProductsBy;
			$('.v-middle').css({
		        '-webkit-transform': 'rotate(' + 0 + 'deg)',  //Safari 3.1+, Chrome  
		        '-moz-transform': 'rotate(' + 0 + 'deg)',     //Firefox 3.5-15  
		        '-ms-transform': 'rotate(' + 0 + 'deg)',      //IE9+  
		        '-o-transform': 'rotate(' + 0 + 'deg)',       //Opera 10.5-12.00  
		        'transform': 'rotate(' + 0 + 'deg)'          //Firefox 16+, Opera 12.50+  

		    });
		}

		return r;
	}

	// Pagination

	$scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.numberOfPages = function() {
    	var products = $scope.applyFilters();
    	if (products) {
    		return Math.ceil(products.length/$scope.pageSize);     
    	}        
    }

    // Filters

    $scope.priceFilterMode = 0;
    $scope.ratingFilterMode = 0;

   	$scope.priceFilter = function(products, type) {
    	var type = parseInt(type);
   		var r = [];
   		// Check products response received
    	if (type>=0 && type<=9 && products) {
    		// Check provides response received
    		if (products[0].minPrice && products[0].maxPrice) {
	    		for (var i = 0; i<products.length; i++) {
	    			switch(type) {
		    			case 0:
		    				r.push(products[i]);
		    				break;
		    			case 1:
		    				if (products[i].minPrice >= 0 && products[i].maxPrice <1) {
		    					r.push(products[i]);
		    				}
		    				break;
		    			case 2:
		    				if (products[i].minPrice >= 1 && products[i].maxPrice <5) {
		    					r.push(products[i]);
		    				}
		    				break;
		    			case 3:
		    				if (products[i].minPrice >= 5 && products[i].maxPrice <10) {
		    					r.push(products[i]);
		    				}
		    				break;
		    			case 4:
		    				if (products[i].minPrice >= 10 && products[i].maxPrice <20) {
		    					r.push(products[i]);
		    				}	
		    				break;
		    			case 5:
		    				if (products[i].minPrice >= 20 && products[i].maxPrice <50) {
		    					r.push(products[i]);
		    				}
		    				break;
		    			case 6:
		    				if (products[i].minPrice >= 50 && products[i].maxPrice <100) {
		    					r.push(products[i]);
		    				}
		    				break;
		    			case 7:
		    				if (products[i].minPrice >= 100 && products[i].maxPrice <200) {
		    					r.push(products[i]);
		    				}
		    				break;
		    			case 8:
		    				if (products[i].minPrice >= 200 && products[i].maxPrice <500) {
		    					r.push(products[i]);
		    				}
		    				break;
		    			case 9:
		    				if (products[i].minPrice >= 500) {
		    					r.push(products[i]);
		    				}
		    				break;
		    		}
	    		}
	    	}
    	}
    	return r;
    }

    $scope.ratingFilter = function(products, type) {
    	var type = parseInt(type);
   		var r = [];
   		if (type>=0 && type<=5 && products) {
   			for (var i = 0; i<products.length; i++) {
   				switch(type) {
	    			case 0:
	    				r.push(products[i]);
	    				break;
	    			case 1:
	    				if (products[i].rating >= 1 && products[i].rating <2) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 2:
	    				if (products[i].rating >= 2 && products[i].rating <3) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 3:
	    				if (products[i].rating >= 3 && products[i].rating <4) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 4:
	    				if (products[i].rating >= 4 && products[i].rating <5) {
	    					r.push(products[i]);
	    				}	
	    				break;
	    			case 5:
	    				if (products[i].rating === 5) {
	    					r.push(products[i]);
	    				}
	    				break;
	    		}
   			}
   		}
   		return r;
    }

    $scope.applyFilters = function() {
    	return $scope.ratingFilter($scope.priceFilter($scope.products, $scope.priceFilterMode), $scope.ratingFilterMode);
    }


}]);