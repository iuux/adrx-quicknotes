'use strict';

var Reflux = require('reflux');
var request = require('superagent');

var data = require('./quickNotes.json');
var actions = require('../actions');
var mixins = require('./mixins');
var config = require('../config');

function requestCallback(succeedCallback, failureCallback) {
  return function(err, res) {
    if(err || !res.ok) {
      if(!!failureCallback) {
        failureCallback(err, res);
      }
      return;
    }
    if(!!succeedCallback) {
      succeedCallback(res);
    }
  }
}

var quickNotesStore = Reflux.createStore({
  mixins: [mixins],
  listenables: actions,
  //
  // Initial
  //
  onGetData: function() {
    var success = function(res) {
      this.data = JSON.parse(res.text);
      this.output();
    }.bind(this);

    var req = request
      .post(this.api('getUserQuickNoteList'))
      .query(this.getQueryParams())
      .end(requestCallback(success));
  },
  //
  // Categories
  //
  createCategory: function(name, callback) {
    var uuid = this.guid();
    var category = {
      categoryId: uuid,
      name: name
    };
    this.data.categories[uuid] = category;
    callback(category);
  },
  onRenameCategory: function(id, name) {
    // Clean input.
    name = name.trim();

    // Error if name matches generic category.
    var isUnspecifiedName = name.toLowerCase() == config.UNSPECIFIED_CATEGORY_NAME.toLowerCase();
    if(isUnspecifiedName) {
      actions.renameCategoryFailed('Category name is not allowed.');
      return;
    }

    // Error if there are existing categories with the same name.
    var categoriesWithDuplicateNames = this.objectToArray(this.data.categories)
      .filter(function(category) {
        var isNotItself = category.categoryId != id;
        var isDuplicate = category.name.toLowerCase() == name.toLowerCase();
        return isNotItself && isDuplicate;
      });
    var isDuplicateName = !!categoriesWithDuplicateNames.length;
    if(isDuplicateName) {
      actions.renameCategoryFailed('Category name already exists.');
      return;
    }

    var query = this.getQueryParams();
    query.category_id = id;
    query.category_name = name;

    var success = function(res) {
      this.renameCategory(id, name);
    }.bind(this);

    var fail = function(err) {
      actions.renameCategoryFailed('Server could not rename category.');
    };

    var req = request
      .post(this.api('updateCategory'))
      .query(query)
      .end(requestCallback(success, fail));
  },
  renameCategory: function(id, name) {
    this.data.categories[id].name = name;
    actions.renameCategorySucceeded(id);
    this.output();
  },
  onDeleteCategory: function(id) {
    // Convert notes list to array.
    this.objectToArray(this.data.notes)
      // Find all notes within the given category.
      .filter(function(note) {
        return note.categoryId == id;
      })
      // Delete all notes within the given category.
      .forEach(function(note) {
        this.deleteNote(note.quickNoteId);
      }.bind(this));

    // Delete the category.
    delete this.data.categories[id];

    actions.deleteCategorySucceeded(id);
    this.output();
  },
  //
  // Notes
  //
  onCreateNote: function(note) {
    note.title = note.title.trim();
    note.body = note.body.trim();
    // Create category, if needed.
    var shouldCreateNewCategory = !!note.newCategoryName && !!note.newCategoryName.length;
    // Simulate long request.
    setTimeout(function() {
      if(shouldCreateNewCategory) {
        this.createCategory(note.newCategoryName, function(category) {
          note.categoryId = category.categoryId;
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
    note.quickNoteId = uuid;
    this.data.notes[uuid] = note;
    actions.createNoteSucceeded(note);
    this.output();
  },
  onUpdateNote: function(id, note) {
    // Clean input.
    note.quickNoteId = id;
    note.title = note.title.trim();
    note.body = note.body.trim();

    // Error if there are existing notes with the same title in the same category.
    var notesWithDuplicateTitles = this.objectToArray(this.data.notes)
      .filter(function(aNote) {
        var isNotItself = aNote.quickNoteId != note.quickNoteId;
        var isDuplicate = aNote.title.toLowerCase() == note.title.toLowerCase();
        var isInSameCategory = aNote.categoryId == note.categoryId;
        return isNotItself && isDuplicate && isInSameCategory;
      });
    var isDuplicateTitle = !!notesWithDuplicateTitles.length;
    if(isDuplicateTitle) {
      actions.updateNoteFailed('Note title already exists in this category.');
      return;
    }

    // Create category, if needed.
    var shouldCreateNewCategory = !!note.newCategoryName && !!note.newCategoryName.length;
    // Simulate long request.
    setTimeout(function() {
      if(shouldCreateNewCategory) {
        this.createCategory(note.newCategoryName, function(category) {
          note.categoryId = category.categoryId;
          this.updateNote(id, note);
        }.bind(this));
      }
      else {
        this.updateNote(id, note);
      }
    }.bind(this), 4000);
  },
  updateNote: function(id, note) {
    this.data.notes[id] = note;
    actions.updateNoteSucceeded(note);
    this.output();
  },
  onDeleteNote: function(id) {
    this.deleteNote(id);
    actions.deleteNoteSucceeded(id);
    this.output();
  },
  deleteNote: function(id) {
    delete this.data.notes[id];
  },
  //
  // Public methods
  //
  hasNotes: function() {
    return !!Object.keys(this.data.notes).length;
  },
  output: function() {
    this.trigger(this.data);
  }
});

module.exports = quickNotesStore;
