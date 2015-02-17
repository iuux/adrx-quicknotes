'use strict';

var Reflux = require('reflux');

var data = require('./noteList.json');
var actions = require('../actions');

var notesStore = Reflux.createStore({
  listenables: actions,
  init: function() {
    this.data = data;
  },
  getInitialState: function() {
    return this.data;
  },
  onUpdateNote: function(id, note) {
    // Clean input.
    note.id = id;
    note.title = note.title.trim();
    note.note = note.note.trim();
    // Create category, if needed.
    var shouldCreateNewCategory = !!note.newCategoryName && !!note.newCategoryName.length;
    // Simulate long request.
    setTimeout(function() {
      if(shouldCreateNewCategory) {
        actions.createCategory(note.newCategoryName, function(category) {
          note.categoryId = category.id;
          this.updateNote(id, note);
        }.bind(this));
      }
      else {
        this.updateNote(id, note);
      }
    }.bind(this), 4000);
  },
  updateNote: function(id, note) {
    this.data[id] = note;
    this.output();
    actions.updateNoteSucceeded(note);
  },
  output: function() {
    this.trigger(this.data);
  }
});

module.exports = notesStore;
