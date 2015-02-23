'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  // General
  'getData',
  // Category
  'getCategory',
  'renameCategory',
  'renameCategoryFailed',
  'renameCategorySucceeded',
  'deleteCategory',
  'deleteCategoryFailed',
  'deleteCategorySucceeded',
  // Note
  'getNote',
  'createNote',
  'createNoteFailed',
  'createNoteSucceeded',
  'updateNote',
  'updateNoteFailed',
  'updateNoteSucceeded',
  'deleteNote',
  'deleteNoteFailed',
  'deleteNoteSucceeded'
]);

module.exports = actions;
