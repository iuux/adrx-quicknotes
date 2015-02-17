'use strict';

var Reflux = require('reflux');

var noteListStore = require('./noteList');
var actions = require('../actions');

var noteStore = Reflux.createStore({
  listenables: actions,
  onGetNote: function(id) {
    var note = noteListStore.data[id];
    this.trigger(note);
  }
});

module.exports = noteStore;
