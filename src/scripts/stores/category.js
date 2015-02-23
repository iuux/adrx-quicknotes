'use strict';

var Reflux = require('reflux');

var quickNotesStore = require('./quickNotes');
var actions = require('../actions');

var actionQueue = [];

var categoryStore = Reflux.createStore({
  listenables: actions,
  init: function() {
    this.listenTo(quickNotesStore, this.onStoreChange);
  },
  onStoreChange: function(status) {
    // Execute and remove all queued actions.
    while(actionQueue.length) {
      var action = actionQueue.pop();
      action();
    }
  },
  onGetCategory: function(id) {
    var hasData = !!quickNotesStore.data;
    // If there's no data, then queue the action to be called later,
    // once there's data.
    if(!hasData) {
      actionQueue.push(function() {
        this.onGetCategory(id);
      }.bind(this));
      return;
    }
    var category = quickNotesStore.data.categories[id];
    if(!category) {
      console.log('ERROR: Category not found (id:', id + ')');
      return;
    }
    this.trigger(category);
  }
});

module.exports = categoryStore;
