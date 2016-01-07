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