'use strict';

var Reflux = require('reflux');

var data = require('./categories.json');
var actions = require('../actions');

var categoriesStore = Reflux.createStore({
  listenables: actions,
  init: function() {
    this.data = data;
  },
  getInitialState: function() {
    return this.data;
  },
  onRenameCategory: function(id, name) {
    this.data[id].name = name;
    //console.log('renaming in store', id, 'to', name);
    //console.log(this.data);
    this.output();
  },
  output: function() {
    this.trigger(this.data);
  }
});

module.exports = categoriesStore;
