'use strict'

angular.module('acme_supermarket').registerCtrl('MyRulesCtrl', ['$scope', '$http', 'ngTableParams', '$route', function ($scope, $http, ngTableParams, $route) {

	$http({
		method: 'GET',
		url: '/api/mypurchasingrules'
	}).
	then(function success(response) {
		$scope.$data = response.data;
		$scope.copy = angular.copy($scope.$data);
		
		$scope.tableParams = new ngTableParams({}, {dataset:$scope.$data});
		
	}, function error(response) {
	});

	/*
	$scope.delete = function(purchasingrule) {
		// close pop up
		var modalInstance = $('#delete-'+purchasingrule._id);
		modalInstance.modal('hide');

		// Aftter 200ms modal closed, delete from db
		setTimeout(
			function() {
				$http({ url: '/api/purchasingrule', 
					method: 'DELETE', 
					data: {id: purchasingrule._id}, 
					headers: {"Content-Type": "application/json;charset=utf-8"}
				}).then(function(res) {
					var i = $scope.$data.indexOf(purchasingrule)
					if(i != -1) {
						$scope.$data.splice(i, 1);
						$scope.copy.splice(i, 1);
					}
					$scope.tableParams.reload()
				}, function(error) {
					console.log(error);
				});
			}, 200);
	}; */

}]);