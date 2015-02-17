'use strict';

module.exports = {
  // http://stackoverflow.com/a/105074
  guid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },
  objectToArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
