'use strict';

var Reflux = require('reflux');
var data = require('./categories.json');

var categoriesStore = Reflux.createStore({
  init: function() {
    this.data = data;
  },
  getInitialState: function() {
    this.trigger(this.data);
    return this.data;
  }
});

module.exports = categoriesStore;
