'use strict';

var Reflux = require('reflux');
var request = require('superagent');

var data = require('./quickNotes.json');
var actions = require('../actions');
var mixins = require('./mixins');

var quickNotesStore = Reflux.createStore({
  mixins: [mixins],
  listenables: actions,
  init: function() {
    this.data = data;
  },
  getInitialState: function() {
    return this.data;
  },
  //
  // Categories
  //
  createCategory: function(name, callback) {
    var uuid = this.guid();
    var category = {
      id: uuid,
      name: name
    };
    this.data.categoryList[uuid] = category;
    callback(category);
  },
  onRenameCategory: function(id, name) {
    // Clean input.
    name = name.trim();

    // Error if there are existing categories with the same name.
    var categoriesWithDuplicateNames = this.objectToArray(this.data.categoryList)
      .filter(function(category) {
        return category.name.toLowerCase() == name.toLowerCase();
      });
    var isDuplicateName = !!categoriesWithDuplicateNames.length;
    if(isDuplicateName) {
      actions.renameCategoryFailed('Category name already exists.');
      return;
    }

    // Simulate long request.
    setTimeout(function() {
      this.renameCategory(id, name);
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
          this.renameCategory(id, _name);
          actions.renameCategoryFailed(id, _name, name);
        }
      }.bind(this));
  },
  renameCategory: function(id, name) {
    this.data.categoryList[id].name = name;
    actions.renameCategorySucceeded(id);
    this.output();
  },
  onDeleteCategory: function(id) {
    // Convert notes list to array.
    this.objectToArray(this.data.noteList)
      // Find all notes within the given category.
      .filter(function(note) {
        return note.categoryId == id;
      })
      // Delete all notes within the given category.
      .forEach(function(note) {
        this.deleteNote(note.id);
      }.bind(this));

    // Delete the category.
    delete this.data.categoryList[id];

    actions.deleteCategorySucceeded(id);
    this.output();
  },
  //
  // Notes
  //
  onCreateNote: function(note) {
    note.title = note.title.trim();
    note.note = note.note.trim();
    // Create category, if needed.
    var shouldCreateNewCategory = !!note.newCategoryName && !!note.newCategoryName.length;
    // Simulate long request.
    setTimeout(function() {
      if(shouldCreateNewCategory) {
        this.createCategory(note.newCategoryName, function(category) {
          note.categoryId = category.id;
          this.createNote(note);
        }.bind(this));
      }
      else {
        this.createNote(note);
      }
    }.bind(this), 4000);
  },
  createNote: function(note) {
    var uuid = this.guid();
    note.id = uuid;
    this.data.noteList[uuid] = note;
    actions.createNoteSucceeded(note);
    this.output();
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
        this.createCategory(note.newCategoryName, function(category) {
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
    this.data.noteList[id] = note;
    actions.updateNoteSucceeded(note);
    this.output();
  },
  onDeleteNote: function(id) {
    this.deleteNote(id);
    actions.deleteNoteSucceeded(id);
    this.output();
  },
  deleteNote: function(id) {
    delete this.data.noteList[id];
  },
  //
  // Public methods
  //
  hasNotes: function() {
    return !!Object.keys(this.data.noteList).length;
  },
  output: function() {
    this.trigger(this.data);
  }
});

module.exports = quickNotesStore;
