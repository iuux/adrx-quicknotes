'use strict';

module.exports = {
  objectToArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
