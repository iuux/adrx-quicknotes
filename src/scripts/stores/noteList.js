'use strict';

var Reflux = require('reflux');

var data = require('./noteList.json');
var actions = require('../actions');

var notesStore = Reflux.createStore({
  listenables: actions,
  init: function() {
    this.data = data;
  },
  getInitialState: function() {
    return this.data;
  },
  onUpdateNote: function(id, note) {
    // Clean input.
    note.id = id;
    note.title = note.title.trim();
    note.note = note.note.trim();
    // Update data.
    this.data[id] = note;
    this.output();
  },
  output: function() {
    this.trigger(this.data);
  }
});

module.exports = notesStore;
