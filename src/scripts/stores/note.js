'use strict';

var Reflux = require('reflux');

var quickNotesStore = require('./quickNotes');
var actions = require('../actions');

var actionQueue = [];

var noteStore = Reflux.createStore({
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
  onGetNote: function(id) {
    var hasData = !!quickNotesStore.data;
    // If there's no data, then queue the action to be called later,
    // once there's data.
    if(!hasData) {
      actionQueue.push(function() {
        this.onGetNote(id);
      }.bind(this));
      return;
    }
    var note = quickNotesStore.data.notes[id];
    if(!note) {
      console.log('ERROR: Quick Note not found (id:', id + ')');
      return;
    }
    this.trigger(note);
  }
});

module.exports = noteStore;
