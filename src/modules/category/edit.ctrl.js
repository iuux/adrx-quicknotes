'use strict';

module.exports = function($stateParams, $state, categoryService) {
  var id = parseInt($stateParams.id);
  var category = categoryService.get(id)
  this.category = angular.copy(category);

  this.cancel = function() {
    $state.transitionTo('app');
  };
};
