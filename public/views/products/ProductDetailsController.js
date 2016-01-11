'use strict'

angular.module('acme_supermarket').registerCtrl('ProductDetailsCtrl', ['$scope', '$http', '$routeParams', '$translate', '$window', function ($scope, $http, $routeParams, $translate, $window) {
	$("form#upload-img-form").hide();

	var id = $routeParams.id;
	var dropzoned = false;

	$(document).on('click', function (event) {
		if (!$(event.target).closest('form#upload-img-form').length && 
			!$(event.target).closest('#btn-edit').length) {
			$("form#upload-img-form").hide();
		}
	});

	Dropzone.autoDiscover = false;
	Dropzone.options.uploadImgForm = {
		paramName: "file",
	}

	$http({
		method: 'GET',
		url: '/api/product/'+id
	}).
	then(function success(response) {
		$scope.product = response.data;
	}, function error(response) {
	});

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

	$scope.isSomethingEditable = function() {
		return  $scope.textNameForm.$visible ||
				$scope.textPriceForm.$visible ||
				$scope.textDescForm.$visible;
	}

	$scope.updateProduct = function(field, data) {
		return $http.post('/api/product/updateProduct',
			{
				id: id,
				field: field,
				data: data
			});
	}
}]);