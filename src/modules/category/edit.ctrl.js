'use strict';

module.exports = function($stateParams, $state, categoryService) {
  var id = parseInt($stateParams.id);
  var category = categoryService.get(id)
  this.category = angular.copy(category);

  this.cancel = function() {
    $state.transitionTo('app');
  };

  this.submit = function() {
    console.log('renaming', category.name, 'to', this.category.name);
    categoryService.rename(id, this.category.name);
    this.cancel();
  };
};
