'use strict';

var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var categorizedNotesStore = require('../stores/categorizedNotes');

var App = React.createClass({
  mixins: [
    Reflux.connect(categorizedNotesStore, 'categorizedNotes')
  ],
  render: function() {
    // Get data.
    var data = this.state.categorizedNotes;
    // Need data to render.
    if( !data ) {
      return null;
    }

    var cx = React.addons.classSet;

    function renderSection(section) {
      return section.map(function(category) {

        var notes = category.notes.map(function(note) {
          return (
            <Link to="note.edit" params={{id: note.id}} className="qn-Nav-item" activeClassName="qn-Nav-item--active">{note.title}</Link>
          );
        });

        // A category is editable if it has an id.
        var categoryName = !!category.id ? <Link to="category.edit" params={{id: category.id}} className="qn-Nav-item" activeClassName="qn-Nav-item--active">{category.name}</Link> : category.name;

        var navHeadingClasses = cx({
          'qn-Nav-heading': true,
          'qn-Nav-heading--unspecified': !category.id
        });

        return (
          <div>
            <h2 className={navHeadingClasses}>{categoryName}</h2>
            {notes}
          </div>
        );
      });
    }

    // Render categorized notes.
    var categorizedSection = renderSection(data.categorized);
    var uncategorizedSection = renderSection([data.uncategorized]);

    return (
      <section className="qn-App">
        <header className="qn-Header">
          <h1 className="qn-Header-heading"><Link to="home">Quick Notes</Link></h1>
          <Link to="note.new" className="qn-Button">New Quick Note</Link>
        </header>
        <div className="qn-App-body">
          <nav className="qn-App-nav qn-Nav">
            {categorizedSection}
            {uncategorizedSection}
          </nav>
          <div className="qn-App-content">
            <RouteHandler {...this.props} />
          </div>
        </div>
      </section>
    );
  }
});

module.exports = App;
