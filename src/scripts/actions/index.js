'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  'getCategory',
  'getNote',
  'renameCategory',
  'renameCategoryFailed'
]);

module.exports = actions;
