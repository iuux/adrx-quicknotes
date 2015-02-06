'use strict';

var moduleName = require('../app.json').name;

angular.module(moduleName, [
  'ui.router'
])
  .config(require('./main.config'))
  .run(require('./main.run'))
  // Services
  .factory('categoriesService', require('./services/categories.factory'))
  .factory('categorizedNotesService', require('./services/categorized-notes.factory'))
  .factory('noteService', require('./services/note.factory'))
  .factory('notesService', require('./services/notes.factory'));