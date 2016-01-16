'use strict'

angular.module('acme_supermarket').registerCtrl('ProductListCtrl', ['$scope', '$http', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/api/products'
	}).
	then(function success(response) {
		$scope.products = response.data;
	}, function error(response) {
	});

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
    	if (type>=0 && type<=9 && products) {
    		for (var i = 0; i<products.length; i++) {
    			switch(type) {
	    			case 0:
	    				r.push(products[i]);
	    				break;
	    			case 1:
	    				if (products[i].price >= 0 && products[i].price <1) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 2:
	    				if (products[i].price >= 1 && products[i].price <5) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 3:
	    				if (products[i].price >= 5 && products[i].price <10) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 4:
	    				if (products[i].price >= 10 && products[i].price <20) {
	    					r.push(products[i]);
	    				}	
	    				break;
	    			case 5:
	    				if (products[i].price >= 20 && products[i].price <50) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 6:
	    				if (products[i].price >= 50 && products[i].price <100) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 7:
	    				if (products[i].price >= 100 && products[i].price <200) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 8:
	    				if (products[i].price >= 200 && products[i].price <500) {
	    					r.push(products[i]);
	    				}
	    				break;
	    			case 9:
	    				if (products[i].price >= 500) {
	    					r.push(products[i]);
	    				}
	    				break;
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