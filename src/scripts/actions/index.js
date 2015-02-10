'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  // Category
  'getCategory',
  'renameCategory',
  'renameCategoryFailed',
  // Note
  'getNote',
  'updateNote'
]);

module.exports = actions;
