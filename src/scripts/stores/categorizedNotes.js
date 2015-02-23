'use strict';

var Reflux = require('reflux');

var mixins = require('./mixins');
var quickNotesStore = require('./quickNotes');
var config = require('../config');

var categorizedNotesStore = Reflux.createStore({
  mixins: [mixins],
  init: function() {
    this.listenTo(quickNotesStore, this.onStoreChange);
  },
  getInitialState: function() {
    return this.data;
  },
  onStoreChange: function(status) {
    var categories = status.categories;
    var notes = status.notes;

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
        // Check if the category exists.
        if( !categories[categoryId] ) {
          console.log('DATABASE ERROR: Category does not exist (id:', categoryId + ')');
          return;
        }
        categories[categoryId].notes.push(note);
      }
      else {
        uncategorizedNotes.push(note);
      }
    });

    // Convert object to array.
    var categorizedNotes = this.objectToArray(categories);

    // Sorting functions.
    function sortNotesByTitle(a, b) {
      return a.title > b.title;
    }

    function sortCategoriesByName(a, b) {
      return a.name > b.name;
    }

    // Sort categories.
    categorizedNotes.sort(sortCategoriesByName);

    // Sort notes.
    categorizedNotes.forEach(function(category) {
      category.notes.sort(sortNotesByTitle);
    });

    // Sort uncategorized notes
    uncategorizedNotes.sort(sortNotesByTitle);

    this.data = {
      categorized: categorizedNotes,
      uncategorized: {
        name: config.UNSPECIFIED_CATEGORY_NAME,
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
