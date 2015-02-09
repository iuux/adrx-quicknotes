'use strict';

var Reflux = require('reflux');
var data = require('./categories.json');

var categoriesStore = Reflux.createStore({
  init: function() {
    this.data = data;
  },
  getInitialState: function() {
    return this.data;
  },
  ping: function() {
    this.trigger(this.data);
  }
});

module.exports = categoriesStore;
