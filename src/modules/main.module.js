'use strict';

var moduleName = require('../app.json').name;

angular.module(moduleName, [
  'ui.router'
])
  .config(require('./main.config'))
  .run(require('./main.run'));
