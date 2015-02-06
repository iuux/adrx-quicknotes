'use strict';

module.exports = function(categoriesService) {
  return {
    get: function(id) {
      return categoriesService[id];
    }
  };
};
