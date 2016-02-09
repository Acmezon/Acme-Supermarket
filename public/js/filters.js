'use strict';

/* Filters */

var filters = angular.module('acme_supermarket.filters', []);

filters.filter('interpolate', function (version) {
	return function (text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	};
});

filters.filter("htmlSafe", ['$sce', function($sce) {
	return function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	};
}]);

filters.filter('startFrom', function() {
    return function(input, start) {
    	if (input) {
    		start = +start; //parse to int
        	return input.slice(start);
    	}
    }
});

filters.filter('hidecc', function(){
	return function (input) {
		if(input == undefined) {
			return input;
		}
		input = input.toString();

		var setCharAt = function(str,index,chr) {
			if(index > str.length-1) return str;
			return str.substr(0,index) + chr + str.substr(index+1);
		}

		for (var i = 0; i < input.length - 4; i++) {
			input = setCharAt(input, i, '*')
		}

		return input;
	}
});

filters.filter('hidecvc', function(){
	return function (input) {
		if(input == undefined) {
			return input;
		}
		input = input.toString();

		var setCharAt = function(str,index,chr) {
			if(index > str.length-1) return str;
			return str.substr(0,index) + chr + str.substr(index+1);
		}

		for (var i = 0; i < input.length - 1; i++) {
			input = setCharAt(input, i, '*')
		}

		return input;
	}
});
