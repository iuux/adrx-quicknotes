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

    function renderSection(section) {
      return section.map(function(category) {

        var notes = category.notes.map(function(note) {
          return (
            <Link to="note.edit" params={{id: note.id}} className="qn-Nav-item" activeClassName="qn-Nav-item--active">{note.title}</Link>
          );
        });

        // A category is editable if it has an id.
        var edit = !!category.id ? <Link to="category.edit" params={{id: category.id}} activeClassName="qn-Nav-item--active">Edit</Link> : null;

        return (
          <div className="qn-Nav-section">
            <div className="qn-Nav-sectionHeader">
              <h2 className="qn-Nav-heading">{category.name}</h2>
              {edit}
            </div>
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
