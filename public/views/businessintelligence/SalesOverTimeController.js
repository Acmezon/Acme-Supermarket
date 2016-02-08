'use strict'

angular.module('acme_supermarket').registerCtrl('SalesOverTimeCtrl', ['$scope', '$http', '$route', function ($scope, $http, $route) {
	var dygraph = new Dygraph(document.getElementById("chart"),
								"http://localhost:3000/api/bi/getSalesOverTime/61");
}]);