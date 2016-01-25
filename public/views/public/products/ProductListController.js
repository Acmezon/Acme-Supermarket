'use strict'

angular.module('acme_supermarket').registerCtrl('ProductListCtrl', ['$scope', '$http', function ($scope, $http) {

	// DEFAULT VALUES
	// Orderings
	$scope.inverseOrder = false;
	$scope.sortProductsBy = 'name';
    // Filters
    $scope.priceFilterMode = 0;
    $scope.ratingFilterMode = 0;
    $scope.categoryFilterMode = -1;
	// Pagination
	$scope.currentPage = 0;
    $scope.pageSize = '10';
    // Inject Math
    $scope.Math = window.Math;

    // INIT

    $http.get('/api/categories')
    	.then( function success (response) {
    		$scope.categories = response.data;
    });

    // Refresh the page (order, filter and pagination)
	$scope.refreshPage = function(callback) {

		$http.post('/api/products/filtered',
			{
				sort : $scope.sortProductsBy,
				order : $scope.inverseOrder ? -1 : 1,
				currentPage : $scope.currentPage,
				pageSize : $scope.pageSize,
				categoryFilter : $scope.categoryFilterMode,
				priceFilter : translatePriceFilter($scope.priceFilterMode),
				ratingFilter : $scope.ratingFilterMode
			}
		).then(function success(response) {
			callback(response.data);
			return;
		});
	};

	// Refresh the pages
	$scope.refreshCount = function(callback) {
		$http.post('/api/products/filtered/count', 
			{
				categoryFilter : $scope.categoryFilterMode,
				priceFilter : translatePriceFilter($scope.priceFilterMode),
				ratingFilter : $scope.ratingFilterMode
			}
		).then(function success(response) {
			callback(response.data);
			return;
		});
	};

	$scope.refresh = function () {
		$scope.refreshCount(function (number) {
    		$scope.numberOfProducts = number;
    		if ($scope.currentPage > Math.ceil($scope.numberOfProducts/parseInt($scope.pageSize))) {
    			$scope.currentPage = 0;
    			$scope.reload();
    		}
    	});
	};

	$scope.reload = function() {
		$scope.refreshPage(function (products) {
    		$scope.products = products;
    		$scope.refresh();
    	});
	};

	// Auxiliar function: priceCode to maxPrice in filter
   	var translatePriceFilter = function(code) {
   		var res = '';
    	code = parseInt(code)
    	if (code>=0 && code<=9) {
			switch(code) {
    			case 0:
    				break;
    			case 1:
    				res = 1;
    				break;
    			case 2:
    				res = 5;
    				break;
    			case 3:
    				res = 10;
    				break;
    			case 4:
    				res = 20;	
    				break;
    			case 5:
    				res = 50;
    				break;
    			case 6:
    				res = 100;
    				break;
    			case 7:
    				res = 200;
    				break;
    			case 8:
    				res = 500;
    				break;
    			case 9:
    				break;
    			default:
    				break;
    		}
    	}
    	return res;
	};

    $scope.reload();


    // FUNCTIONS

    


	// Clear filters
	$scope.clearFilters = function(){
		$scope.priceFilterMode = 0;
    	$scope.ratingFilterMode = 0;
    	$scope.categoryFilterMode = -1;
    	$scope.reload();
	};

	// Change Category filter
	$scope.categoryFilter = function(mode) {
		$scope.categoryFilterMode = mode;
    	$scope.reload();
	};

	// Change Price filter
	$scope.priceFilter = function(mode) {
		$scope.priceFilterMode = mode;
    	$scope.reload();
	};

	// Change Rating filter
	$scope.ratingFilter = function(mode) {
		$scope.ratingFilterMode = mode;
    	$scope.reload();
	};

	// Invert order button
	$scope.invertOrder = function() {
		$scope.inverseOrder = !$scope.inverseOrder;
		if ($scope.inverseOrder) {
			// Method to make image rotate
			$('.v-middle').css({
		        '-webkit-transform': 'rotate(' + 180 + 'deg)',  //Safari 3.1+, Chrome  
		        '-moz-transform': 'rotate(' + 180 + 'deg)',     //Firefox 3.5-15  
		        '-ms-transform': 'rotate(' + 180 + 'deg)',      //IE9+  
		        '-o-transform': 'rotate(' + 180 + 'deg)',       //Opera 10.5-12.00  
		        'transform': 'rotate(' + 180 + 'deg)'          //Firefox 16+, Opera 12.50+  

		    });
		} else {
			$('.v-middle').css({
		        '-webkit-transform': 'rotate(' + 0 + 'deg)',  //Safari 3.1+, Chrome  
		        '-moz-transform': 'rotate(' + 0 + 'deg)',     //Firefox 3.5-15  
		        '-ms-transform': 'rotate(' + 0 + 'deg)',      //IE9+  
		        '-o-transform': 'rotate(' + 0 + 'deg)',       //Opera 10.5-12.00  
		        'transform': 'rotate(' + 0 + 'deg)'          //Firefox 16+, Opera 12.50+  

		    });
		}

		$scope.reload();
	};

	$http.get('/api/myRecommendations').then(function success(products) {
		$http.post('/api/product/getByIdList', { products : products}).then(
			function success(product_list) {
				$scope.recommendedProducts = product_list.data;
			}, function error(response){});
	}, function error(response) {});

}]);