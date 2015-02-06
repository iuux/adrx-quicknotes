'use strict';

module.exports = function(categorizedNotesService, $rootScope) {

  this.notes = categorizedNotesService.data;

  $rootScope.$watch(function() { return categorizedNotesService.data; }, function() {
    console.log('watching for category note service changes', categorizedNotesService.data);
    this.notes = categorizedNotesService.data;
  }, true);
};
