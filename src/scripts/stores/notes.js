'use strict';

var Reflux = require('reflux');
var data = require('./notes.json');

var notesStore = Reflux.createStore({
  init: function() {
    this.data = data;
  },
  getInitialState: function() {
    this.trigger(this.data);
    return this.notes;
  }
});

module.exports = notesStore;
