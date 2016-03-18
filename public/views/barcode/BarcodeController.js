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
			var p_id = response['p_id']
			if(p_id) {
				$location.url('/product/' + p_id)
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