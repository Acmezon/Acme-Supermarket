'use strict'

angular.module('acme_supermarket').registerCtrl('BarcodeCtrl', ['$scope', '$http', '$translate', '$location', 'ngToast',
function ($scope, $http, $translate, $location, ngToast) {
	//Dropzone configuration
	Dropzone.autoDiscover = false;
	Dropzone.options.uploadImgForm = {
		paramName: "file",
	}

	$translate(['Product.BarcodeUpload']).then(function (translation) {
		var imgDropzone = new Dropzone("form#upload-img-form", 
		{ 
			acceptedFiles: "image/*",
			uploadMultiple: false,
			maxFiles: 1
		});

		imgDropzone.on('success', function(file, response){
			if(response['success']) {
				$location.url('/product/' + response['p_id'])
				$scope.$apply()
			} else {
				$translate(['Product.BarcodeScanError']).then(function (translation) {
					imgDropzone.removeAllFiles(true)
					ngToast.create({
						className: 'danger',
						content: translation['Product.BarcodeScanError']
					});
				});
			}
		});

		$("form#upload-img-form").html(translation['Product.Upload'])

		$("form#upload-img-form").show();
	});
}]);