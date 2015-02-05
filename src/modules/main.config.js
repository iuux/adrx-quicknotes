'use strict';

module.exports = function($stateProvider, $urlRouterProvider) {

  //
  // Routing
  //
  // For any unmatched url, send to a default route
  $urlRouterProvider.otherwise('/');

  //
  // States
  //
  $stateProvider
    .state('app', {
      //abstract: true,
      url: '/',
      templateUrl: 'app.html',
      controller: require('./app.ctrl')
    });
};
