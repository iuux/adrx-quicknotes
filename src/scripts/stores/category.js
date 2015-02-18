'use strict';

var Reflux = require('reflux');

var quickNotesStore = require('./quickNotes');
var actions = require('../actions');

var categoryStore = Reflux.createStore({
  listenables: actions,
  onGetCategory: function(id) {
    var category = quickNotesStore.data.categoryList[id];
    this.trigger(category);
  }
});

module.exports = categoryStore;
