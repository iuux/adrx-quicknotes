'use strict';

module.exports = function($stateParams, $state, noteService) {
  var id = parseInt($stateParams.id);
  var note = noteService.get(id)
  this.note = angular.copy(note);

  this.cancel = function() {
    $state.transitionTo('app');
  };
};
