'use strict';

module.exports = function(categoriesService, notesService) {
  // Duplicate the list of categories, since we'll also be modifying it.
  var categories = angular.copy(categoriesService);
  // Create an array to hold each category's notes.
  angular.forEach(categories, function(category) {
    category.notes = [];
  });

  // Create an array to hold any uncategorized notes.
  var uncategorizedNotes = [];

  // Add each note to its defined category, if provided.
  // If there's no category, then declare it uncategorized.
  angular.forEach(notesService, function(note) {
    var categoryId = note.categoryId;
    if( !!categoryId ) {
      categories[categoryId].notes.push(note);
    }
    else {
      uncategorizedNotes.push(note);
    }
  });

  // Convert category object into array.
  var categoriesArray = [];
  angular.forEach(categories, function(category) {
    categoriesArray.push(category);
  });

  // Return merged data.
  return {
    categorized: categoriesArray,
    uncategorized: {
      name: 'Unspecified',
      notes: uncategorizedNotes
    }
  };
};
