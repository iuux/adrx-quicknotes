'use strict';

var Reflux = require('reflux');

var mixins = require('./mixins');
var categoriesStore = require('./categories');
var notesStore = require('./notes');

var categorizedNotesStore = Reflux.createStore({
  mixins: [mixins],
  init: function() {
    // Join stores with callback.
    this.joinTrailing(categoriesStore, notesStore, this.process);
    // Trigger the stores.
    categoriesStore.output();
    notesStore.output();
  },
  getInitialState: function() {
    return this.data;
  },
  process: function(categories, notes) {
    categories = categories[0];
    notes = notes[0];

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

    // Sort categories by name
    // Sort categorized notes by title
    // Sort uncategorized notes by title

    this.data = {
      categorized: this.objectToArray(categories),
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
