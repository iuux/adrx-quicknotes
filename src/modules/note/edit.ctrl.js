'use strict';

module.exports = function($stateParams, noteService) {
  var id = parseInt($stateParams.id);
  var note = noteService.get(id)
  this.note = angular.copy(note);
};
