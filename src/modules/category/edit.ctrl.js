'use strict';

module.exports = function($stateParams, categoryService) {
  var id = parseInt($stateParams.id);
  var category = categoryService.get(id)
  this.category = angular.copy(category);
};
