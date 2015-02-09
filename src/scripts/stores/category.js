'use strict';

var Reflux = require('reflux');

var categoryListStore = require('./categoryList');
var actions = require('../actions');

var categoryStore = Reflux.createStore({
  listenables: actions,
  onGetCategory: function(id) {
    var category = categoryListStore.data[id];
    this.trigger(category);
  }
});

module.exports = categoryStore;
