'use strict';

var Reflux = require('reflux');

var quickNotesStore = require('./quickNotes');
var actions = require('../actions');

var noteStore = Reflux.createStore({
  listenables: actions,
  onGetNote: function(id) {
    var note = quickNotesStore.data.noteList[id];
    this.trigger(note);
  }
});

module.exports = noteStore;
