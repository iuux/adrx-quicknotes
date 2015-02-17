'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  // Category
  'createCategory',
  'getCategory',
  'renameCategory',
  'renameCategoryFailed',
  'renameCategorySucceeded',
  // Note
  'getNote',
  'updateNote',
  'updateNoteSucceeded'
]);

module.exports = actions;
