'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  // Category
  'getCategory',
  'renameCategory',
  'renameCategoryFailed',
  'renameCategorySucceeded',
  // Note
  'getNote',
  'updateNote'
]);

module.exports = actions;
