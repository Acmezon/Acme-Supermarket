'use strict';

/* Directives */

var directives = angular.module('acme_supermarket.directives', []);

directives.directive('appVersion', function (version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
});

directives.directive('localeSelector', 
	function($translate) {
		return {
			restrict: 'A',
			replace: true,
			templateUrl: 'views/public/localeselector/locale-selector.html',
			link: function(scope, elem, attrs) {
				if($translate.use() == undefined) {
					scope.locale = $translate.proposedLanguage()
				} else {
					scope.locale = $translate.use();
				}

				scope.setLocale = function() {
					$translate.use(scope.locale);
				};
			}
		};
	}
	);

directives.directive('restrict', function(authService){
	return{
		restrict: 'A',
		prioriry: 100000,
		scope: false,
		link: function(){
			// alert('ergo sum!');
		},
		compile:  function(element, attr, linker){
			var accessDenied = true;
			
			var removeRestricted = function (role) {
				var attributes = attr.access.split(" ");
				if(attributes.length == 1 && attributes[0] == "isLogged") {
					if(role != "anonymous") {
						accessDenied = false;
					}
				} else {
					for(var i in attributes){
						if(role == attributes[i]){
							accessDenied = false;
						}
					}
				}


				if(accessDenied){
					element.children().remove();
					element.remove();			
				}
			};

			authService.getRole(removeRestricted);
		}
	}
});

directives.directive('showtab', function() {
	return {
		link: function(scope, element, attrs) {
			element.click(function (event) {
				event.preventDefault();
				$(element).tab('show');
			});
		}
	};
});

directives.directive('equals', function() {
	return {
		restrict: 'A', // only activate on element attribute
		require: '?ngModel', // get a hold of NgModelController
		link: function(scope, elem, attrs, ngModel) {
			if(!ngModel) return; // do nothing if no ng-model

			// watch own value and re-validate on change
			scope.$watch(attrs.ngModel, function() {
				validate();
			});

			// observe the other value and re-validate on change
			attrs.$observe('equals', function (val) {
				validate();
			});

			var validate = function() {
				// values
				var val1 = ngModel.$viewValue;
				var val2 = attrs.equals;

				// set validity
				ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
			};
		}
	}
});