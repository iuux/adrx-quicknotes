'use strict';

var Reflux = require('reflux');

var mixins = require('./mixins');
var quickNotesStore = require('./quickNotes');

var categorizedNotesStore = Reflux.createStore({
  mixins: [mixins],
  init: function() {
    // Listen to store.
    this.listenTo(quickNotesStore, this.onStoreChange);
    // Trigger the store.
    quickNotesStore.output();
  },
  getInitialState: function() {
    return this.data;
  },
  onStoreChange: function(status) {
    var categories = status.categoryList;
    var notes = status.noteList;

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

    // Convert object to array.
    var categorizedNotes = this.objectToArray(categories);

    // Remove categories without any notes.
    var categorizedNotes = categorizedNotes.filter(function(category) {
      return !!category.notes.length;
    });

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
