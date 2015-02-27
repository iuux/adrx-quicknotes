'use strict';

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/App');
var Home = require('./components/Home');
var EditCategory = require('./components/Category.edit');
var NewNote = require('./components/Note.new');
var EditNote = require('./components/Note.edit');

var routes = (
  <Route handler={App}>
    <DefaultRoute name="home" handler={Home} />
    <Route name="category.edit" handler={EditCategory} path="/category/edit/:id" />
    <Route name="note.new" handler={NewNote} path="/note/new" />
    <Route name="note.edit" handler={EditNote} path="/note/edit/:id" />
  </Route>
);

Router.run(routes, function(Handler, state) {
  React.render(<Handler params={state.params} />, document.getElementById('adrx-qn-app'));
});

// Eliminate 300ms click delay on mobile.
var FastClick = require('fastclick');
FastClick.attach(document.body);
