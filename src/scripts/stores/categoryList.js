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
    // Simulate long request.
    setTimeout(function() {
      actions.renameCategorySucceeded(id);
      this._renameCategory(id, name);
      //actions.renameCategoryFailed(id, _name, name);
    }.bind(this), 4000);
  },
  _onRenameCategory: function(id, name) {
    // Retain source.
    var _name = this.data[id].name;
    // Clean input.
    name = name.trim();
    // Optimistically rename.
    this._renameCategory(id, name);
    // Send request.
    var api = 'http://156.56.176.66:8080/sisaarex-dev/adrx/portal.do?methodToCall=updateCategory';
    //api += '&sr=1ff3660c-4f1d-4894-a1b7-854a9e236bbf';
    var req = request
      .post(api)
      .type('form')
      //.get(api)
      .send({
      //.query({
        category_id: 1,
        category_name: name
      })
      .end(function(err, res) {
        console.log('response', err, res, req);
        // Update failed. Revert changes.
        if(err || !res.ok) {
          console.log('Update failed. Reverting to', _name);
          this._renameCategory(id, _name);
          actions.renameCategoryFailed(id, _name, name);
        }
      }.bind(this));
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
