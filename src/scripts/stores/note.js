'use strict';

var Reflux = require('reflux');

var notesStore = require('./notes');
var actions = require('../actions');

var noteStore = Reflux.createStore({
  listenables: actions,
  onGetNote: function(id) {
    var note = notesStore.data[id];
    this.trigger(note);
  }
});

module.exports = noteStore;
