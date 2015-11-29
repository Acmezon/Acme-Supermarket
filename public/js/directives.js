'use strict';

/* Directives */

angular.module('acme_supermarket.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });
