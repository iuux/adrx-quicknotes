'use strict';

var Reflux = require('reflux');

var mixins = require('./mixins');
var categoryListStore = require('./categoryList');
var noteListStore = require('./noteList');

var categorizedNotesStore = Reflux.createStore({
  mixins: [mixins],
  init: function() {
    // Listen to stores.
    this.listenTo(categoryListStore, this.onCategoryListStoreChange);
    this.listenTo(noteListStore, this.onNoteListStoreChange);
    // Trigger the stores.
    categoryListStore.output();
    noteListStore.output();
  },
  getInitialState: function() {
    return this.data;
  },
  onCategoryListStoreChange: function(status) {
    this.categoryListStoreCache = status;
    this.process();
  },
  onNoteListStoreChange: function(status) {
    this.noteListStoreCache = status;
    this.process();
  },
  process: function() {
    // Get cached stores.
    var categories = this.categoryListStoreCache;
    var notes = this.noteListStoreCache;

    // Don't do anything if there aren't cached stores.
    if( !categories || !notes ) {
      return;
    }

    // Create an array to hold each category's notes.
    Object.keys(categories).forEach(function(key) {
      categories[key].notes = [];
    });

    // Create an array to hold any uncategorized notes.
    var uncategorizedNotes = [];

    // Add each note to its defined category, if provided.
    // If there's no category, then declare it uncategorized.
    Object.keys(notes).forEach(function(key) {
      var note = notes[key];
      var categoryId = note.categoryId;
      if( !!categoryId ) {
        categories[categoryId].notes.push(note);
      }
      else {
        uncategorizedNotes.push(note);
      }
    });

    // Sorting functions.
    function sortNotesByTitle(a, b) {
      return a.title > b.title;
    }

    function sortCategoriesByName(a, b) {
      return a.name > b.name;
    }

    // Sort categories.
    var categorizedNotes = this.objectToArray(categories).sort(sortCategoriesByName);

    // Sort notes.
    categorizedNotes.forEach(function(category) {
      category.notes.sort(sortNotesByTitle);
    });

    // Sort uncategorized notes
    uncategorizedNotes.sort(sortNotesByTitle);

    this.data = {
      categorized: categorizedNotes,
      uncategorized: {
        name: 'Unspecified',
        notes: uncategorizedNotes
      }
    };

    this.output();
  },
  output: function() {
    this.trigger(this.data);
  }
});

module.exports = categorizedNotesStore;
