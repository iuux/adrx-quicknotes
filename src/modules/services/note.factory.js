'use strict';

module.exports = function(notesService) {
  return {
    get: function(id) {
      return notesService[id];
    }
  };
};
