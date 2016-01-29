'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('acme_supermarket.services', [])

services.value('version', '0.1');

services.service('authService', function($http){
	return{
		getRole: function( removeRestricted ){
			$http({
				method: 'GET',
				url: '/api/getUserRole'
			}).
			then(function success(response) {
				var role = response.data;

				removeRestricted(role);
			}, function error(response) {
				console.log("error");
			});
		}
	}
});