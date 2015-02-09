'use strict';

var Reflux = require('reflux');

var actions = Reflux.createActions([
  'getCategory',
  'getNote',
  'renameCategory'
]);

module.exports = actions;
