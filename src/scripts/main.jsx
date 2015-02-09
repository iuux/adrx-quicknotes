'use strict';

var React = require('react');
var App = require('./components/app');

React.render(<App/>, document.getElementById('app'));

//var fastClick = require('fastclick');
// fastclick eliminates 300ms click delay on mobile
//fastClick(document.body);
