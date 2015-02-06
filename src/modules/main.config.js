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
      url: '/',
      templateUrl: 'app.html',
      controller: require('./app.ctrl'),
      controllerAs: 'app'
    })
    .state('app.note', {
      abstract: true,
      url: 'note',
      template: '<div ui-view></div>'
    })
    .state('app.note.new', {
      url: '/new',
      templateUrl: 'note/new.html',
      controller: require('./note/new.ctrl')
    })
    .state('app.note.edit', {
      url: '/edit/:id',
      templateUrl: 'note/edit.html',
      controller: require('./note/edit.ctrl')
    });
};
