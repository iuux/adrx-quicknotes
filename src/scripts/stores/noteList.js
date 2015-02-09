'use strict';

var Reflux = require('reflux');

var data = require('./noteList.json');

var notesStore = Reflux.createStore({
  init: function() {
    this.data = data;
  },
  getInitialState: function() {
    return this.data;
  },
  output: function() {
    this.trigger(this.data);
  }
});

module.exports = notesStore;
