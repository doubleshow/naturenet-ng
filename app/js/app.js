'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'google-maps',
  'ui.bootstrap',
  'mgcrea.ngStrap',
  'akoenig.deckgrid',
  'angularMoment',
  'ngCookies'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/landing.html'});
  $routeProvider.when('/site/:name', {templateUrl: 'partials/site.html', controller: 'SiteController'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
