'use strict';

var Reflux = require('reflux');

var categoriesStore = require('./categories');
var actions = require('../actions');

var categoryStore = Reflux.createStore({
  listenables: actions,
  onGetCategory: function(id) {
    var category = categoriesStore.data[id];
    this.trigger(category);
  }
});

module.exports = categoryStore;
