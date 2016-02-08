'use strict'

angular.module('acme_supermarket').registerCtrl('ReportCtrl', ['$scope', '$http', '$translate', 'ngToast', function ($scope, $http, $translate, ngToast) {

	$scope.Math = Math;

	var url = 'guide.pdf';
	$scope.page = 1;
	$scope.scale = 1.5;


	$scope.loadDocument = function () {
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
			pdf.getPage($scope.page).then(function getPage(page) {
				var scale = $scope.scale;
				var viewport = page.getViewport(scale);

				//
				// Prepare canvas using PDF page dimensions
				//
				var canvas = document.getElementById('the-canvas');
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
		if ($scope.supplierEmail && $scope.year && $scope.year>=2010) {
			
		} else {
			$translate(['Reports.Error.InvalidParams']).then(function (translation) {
				ngToast.create({
					className: 'danger',
					content: translation['Reports.Error.InvalidParams']
				});
			});
		}
	};

	$scope.nextPage = function () {
		$scope.page = $scope.page+1;
		$scope.loadDocument();
	};

	$scope.previousPage = function() {
		$scope.page = Math.max(1, $scope.page-1);
		$scope.loadDocument();
	}

	$scope.loadDocument();

}]);