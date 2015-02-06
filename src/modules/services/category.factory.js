'use strict';

module.exports = function(categoriesService, $http) {
  return {
    get: function(id) {
      return categoriesService[id];
    },
    rename: function(id, name) {
      categoriesService[id].name = name;
      /*
      var data = { id: id, name: name };
      $http.post('', data)
        .success(function() {
          console.log('renamed category to', name);
        })
        .error(function() {
          console.log('error renaming category');
        });
      */
    }
  };
};
