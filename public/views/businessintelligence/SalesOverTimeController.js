'use strict'

angular.module('acme_supermarket').registerCtrl('SalesOverTimeCtrl', ['$scope', '$http', '$translate', function ($scope, $http, $translate) {
	$scope.supplierEmail = '';
	$('#chart-loading').hide();
	$('#sales-chart').hide();

	$scope.plotChart = function() {
		if($scope.supplierEmail == '') {
			return false;
		}
		
		if($('#sales-chart').is(':visible')) {
			$('#sales-chart').fadeOut(function (){
				$('#chart-loading').fadeIn();
			});
		} else {
			$('#chart-loading').fadeIn();
		}

		$http.get('/api/supplier/byemail/' + $scope.supplierEmail)
		.then(function success(response) {
			if(response.data._id == undefined) {
				return false;
				$('#chart-loading').fadeOut();
			}

			var supplier = response.data;
			var name = supplier.name + " " + supplier.surname;

			$translate(['SalesOverTime.ChartTitle', 'SalesOverTime.YLabel', 'SalesOverTime.XLabel']).then(function (translation) {
				var url = "/api/bi/getSalesOverTime/" + supplier._id;

				if($scope.product_id != undefined && $scope.product_id != '') {
					url += '?productid=' + $scope.product_id
				}

				var dygraph = new Dygraph(
					document.getElementById("sales-chart"),
					url,
					{
						connectSeparatedPoints: true,
						delimiter: ';',
						width: 900,
						height: 700,
						stackedGraph: false,

						highlightCircleSize: 2,
						strokeWidth: 1,
						strokeBorderWidth: 1,

						highlightSeriesOpts: {
							strokeWidth: 3,
							strokeBorderWidth: 1,
							highlightCircleSize: 5
						},

						title: translation['SalesOverTime.ChartTitle'] + " " + name,
						ylabel: translation['SalesOverTime.YLabel'],
						xlabel: translation['SalesOverTime.XLabel'],
						showRangeSelector: true,
						legend: 'follow'
					});

				var onclick = function(ev) {
					if (dygraph.isSeriesLocked()) {
						dygraph.clearSelection();
					} else {
						dygraph.setSelection(dygraph.getSelection(), dygraph.getHighlightSeries(), true);
					}
				};

				var onDrawn = function(graph, is_initial) {
					if(is_initial) {
						$('#chart-loading').fadeOut(function () {
							$('#sales-chart').fadeIn();
						});
					}
				}

				dygraph.updateOptions({clickCallback: onclick, drawCallback: onDrawn}, true);
			});
		},
		function error(response){});
	}
}]);