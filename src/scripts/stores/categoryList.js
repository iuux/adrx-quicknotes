'use strict';

var Reflux = require('reflux');
var request = require('superagent');

var data = require('./categoryList.json');
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
    // Retain source.
    var _name = this.data[id].name;
    // Clean input.
    name = name.trim();
    // Optimistically rename.
    this._renameCategory(id, name);
    // Retain context.
    var _this = this;
    // Send request.
    var api = 'http://156.56.176.66:8080/sisaarex-dev/adrx/portal.do?methodToCall=updateCategory&sr=';
    api += '1ff3660c-4f1d-4894-a1b7-854a9e236bbf';
    request
      .post(api)
      .send({
        category_id: 1,
        category_name: name
      })
      .end(function(err, res) {
        console.log('response', err);
        // Update failed. Revert changes.
        if(err || !res.ok) {
          console.log('Update failed. Reverting to', _name);
          _this._renameCategory(id, _name);
          actions.renameCategoryFailed(id, _name, name);
        }
      });
  },
  _renameCategory: function(id, name) {
    this.data[id].name = name;
    this.output();
  },
  output: function() {
    this.trigger(this.data);
  }
});

module.exports = categoriesStore;
