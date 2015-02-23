'use strict';

module.exports = {
  // http://codereview.stackexchange.com/a/10396
  getQueryParams: function() {
    var query = (window.location.search || '?').substr(1);
    var map = {};

    query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
      map[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    return map;
  },
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
