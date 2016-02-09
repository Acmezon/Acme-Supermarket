'use strict'

angular.module('acme_supermarket').registerCtrl('ReportCtrl', ['$scope', '$http', '$translate', 'ngToast', function ($scope, $http, $translate, ngToast) {

	$scope.today = new Date();

	$scope.loadDocument = function (url) {
		// Disable workers to avoid yet another cross-origin issue (workers need
		// the URL of the script to be loaded, and dynamically loading a cross-origin
		// script does not work).
		//
		// PDFJS.disableWorker = true;

		//
		// The workerSrc property shall be specified.
		//
		PDFJS.workerSrc = 'js/lib/pdf.worker.js';

		//
		// Asynchronous download PDF
		//
		PDFJS.getDocument(url).then(function getPdf(pdf) {
			//
			// Fetch the first page
			//
			pdf.getPage(1).then(function getPage(page) {
				var scale = 1.7;
				var viewport = page.getViewport(scale);

				//
				// Prepare canvas using PDF page dimensions
				//
				var canvas = document.getElementById('pdf-canvas');
				var context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				//
				// Render PDF page into canvas context
				//
				var renderContext = {
					canvasContext: context,
					viewport: viewport
				};

				page.render(renderContext);
			});
		});
	};
	

	$scope.loadReport = function () {
		var today = new Date();
		if ($scope.supplierEmail && $scope.year && $scope.year>=2010 && $scope.year<=today.getFullYear()) {
			$http({
				method: 'POST',
				url: '/api/bi/getReport',
				data: {
					year: $scope.year,
					supplier_email: $scope.supplierEmail
				}
			}).
			then(function success(response) {
				if (response.data.success) {
					$scope.url = response.data.url;
					$translate(['Reports.Success']).then(function (translation) {
						ngToast.create({
							className: 'success',
							content: translation['Reports.Success']
						});
					});
					$scope.loadDocument($scope.url);
				} else {
					$translate(['Reports.Error.SupplierNotFound']).then(function (translation) {
						ngToast.create({
							className: 'danger',
							content: translation['Reports.Error.SupplierNotFound']
						});
					});
				}
				
			});
		} else {
			$translate(['Reports.Error.InvalidParams']).then(function (translation) {
				ngToast.create({
					className: 'danger',
					content: translation['Reports.Error.InvalidParams']
				});
			});
		}
	};

}]);