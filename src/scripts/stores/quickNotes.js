'use strict';

var Reflux = require('reflux');
var request = require('superagent');

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
      var value = res.text;
      if(res.type == 'application/json') {
        value = JSON.parse(value);
      }
      succeedCallback(value);
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
    actions.getDataCalled();

    function renderErrorMessage() {
      return (
        <span>
          Quick Notes could not load.
          Please <button className="qn-Alert-link" onClick={actions.getData}>try again</button>.
        </span>
      );
    }

    var success = function(json) {
      this.data = json;
      actions.getDataSucceeded();
      this.output();
    }.bind(this);

    var fail = function() {
      actions.getDataFailed(renderErrorMessage());
    }.bind(this);

    var req = request
      .post(this.api('getUserQuickNoteList'))
      .query(this.getQueryParams())
      .end(requestCallback(success, fail));
  },
  //
  // Categories
  //
  onRenameCategory: function(id, name) {
    // Clean input.
    name = name.trim();

    // Error if name matches generic category.
    var isUnspecifiedName = name.toLowerCase() == config.UNSPECIFIED_CATEGORY_NAME.toLowerCase();
    if(isUnspecifiedName) {
      actions.renameCategoryFailed('Category name already exists.');
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

    var success = function(json) {
      this.data = json;
      actions.renameCategorySucceeded(id);
      this.output();
    }.bind(this);

    var fail = function() {
      actions.renameCategoryFailed('Could not rename. Please try again.');
    };

    var req = request
      .post(this.api('updateCategory'))
      .query(query)
      .end(requestCallback(success, fail));
  },
  onDeleteCategory: function(id) {
    var query = this.getQueryParams();
    query.category_id = id;

    var success = function(json) {
      this.data = json;
      actions.deleteCategorySucceeded();
      this.output();
    }.bind(this);

    var fail = function() {
      actions.deleteCategoryFailed('Could not delete category. Please try again.');
    };

    var req = request
      .post(this.api('deleteCategory'))
      .query(query)
      .end(requestCallback(success, fail));
  },
  //
  // Notes
  //
  onCreateNote: function(note) {
    // Clean input.
    note.title = note.title.trim();
    note.body = note.body.trim();

    // Create category, if needed.
    var shouldCreateNewCategory = !!note.newCategoryName && !!note.newCategoryName.length;

    // Error if there are existing notes with the same title in the same category.
    if(!shouldCreateNewCategory) {
      var notesWithDuplicateTitles = this.objectToArray(this.data.notes)
        .filter(function(aNote) {
          var isDuplicate = aNote.title.toLowerCase() == note.title.toLowerCase();
          var isInSameCategory = aNote.categoryId == note.categoryId;
          return isDuplicate && isInSameCategory;
        });
      var isDuplicateTitle = !!notesWithDuplicateTitles.length;
      if(isDuplicateTitle) {
        actions.createNoteFailed('Note title already exists in this category.');
        return;
      }
    }

    var query = this.getQueryParams();
    query.quick_note_title = note.title;
    query.quick_note_body = note.body;

    if(shouldCreateNewCategory) {
      query.category_name = note.newCategoryName;
    }
    else {
      query.category_id = note.categoryId;
    }

    var success = function(json) {
      this.data = json;
      actions.createNoteSucceeded();
      this.output();
    }.bind(this);

    var fail = function() {
      actions.createNoteFailed('Could not create Quick Note. Please try again.');
    };

    var req = request
      .post(this.api('createQuickNote'))
      .query(query)
      .end(requestCallback(success, fail));
  },
  onUpdateNote: function(id, note) {
    // Clean input.
    note.quickNoteId = id;
    note.title = note.title.trim();
    note.body = note.body.trim();

    // Create category, if needed.
    var shouldCreateNewCategory = !!note.newCategoryName && !!note.newCategoryName.length;

    // Error if there are existing notes with the same title in the same category.
    if(!shouldCreateNewCategory) {
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
    }

    var query = this.getQueryParams();
    query.quick_note_id = id;
    query.quick_note_title = note.title;
    query.quick_note_body = note.body;

    if(shouldCreateNewCategory) {
      query.category_name = note.newCategoryName;
    }
    else {
      query.category_id = note.categoryId;
    }

    var success = function(json) {
      this.data = json;
      actions.updateNoteSucceeded();
      this.output();
    }.bind(this);

    var fail = function() {
      actions.updateNoteFailed('Could not update Quick Note. Please try again.');
    };

    var req = request
      .post(this.api('updateQuickNote'))
      .query(query)
      .end(requestCallback(success, fail));
  },
  onDeleteNote: function(id) {
    var query = this.getQueryParams();
    query.quick_note_id = id;

    var success = function(json) {
      this.data = json;
      actions.deleteNoteSucceeded();
      this.output();
    }.bind(this);

    var fail = function() {
      actions.deleteNoteFailed('Could not delete Quick Note. Please try again.');
    };

    var req = request
      .post(this.api('deleteQuickNote'))
      .query(query)
      .end(requestCallback(success, fail));
  },
  //
  // Public methods
  //
  hasData: function() {
    return !!this.data;
  },
  hasNotes: function() {
    return !!Object.keys(this.data.notes).length;
  },
  output: function() {
    this.trigger(this.data);
  }
});

module.exports = quickNotesStore;
