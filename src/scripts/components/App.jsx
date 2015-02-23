'use strict';

var React = require('react');
var cx = React.addons.classSet;
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var actions = require('../actions');
var categorizedNotesStore = require('../stores/categorizedNotes');
var quickNotesStore = require('../stores/quickNotes');

var App = React.createClass({
  mixins: [
    Router.State,
    Reflux.connect(categorizedNotesStore, 'categorizedNotes')
  ],
  componentDidMount: function() {
    actions.getData();
  },
  render: function() {
    var hasData = quickNotesStore.hasData();

    var buttonStyle = hasData ? null : { visibility: 'hidden' };
    var processIndicator = hasData ? null : (<span className="qn-ProcessIndicator"/>);

    var body = hasData ? this.renderBody() : null;

    return (
      <section className="qn-App">
        <header className="qn-Header">
          <h1 className="qn-Header-heading">
            <Link to="home" className="qn-Header-headingLink">Quick Notes</Link>
          </h1>
          <Link to="note.new" className="qn-Button" style={buttonStyle}
            activeClassName="qn-Button--disabled">New Quick Note</Link>
          {processIndicator}
        </header>
        {body}
      </section>
    );
  },
  renderBody: function() {
    // Render empty state.
    var isHome = this.isActive('home');
    var hasNotes = quickNotesStore.hasNotes();
    var emptyState = isHome && !hasNotes ? this.renderEmptyState() : null;

    // Get data.
    var data = this.state.categorizedNotes;
    // Render categorized notes.
    var categorizedSection = this.renderSection(data.categorized);
    // Only render uncategorized notes section if there are child notes.
    var hasUncategorizedNotes = !!data.uncategorized.notes.length;
    var uncategorizedSection = hasUncategorizedNotes ? this.renderSection([data.uncategorized]) : null;

    return (
      <div>
        {emptyState}
        <div className="qn-App-body">
          <nav className="qn-App-nav qn-Nav">
            {categorizedSection}
            {uncategorizedSection}
          </nav>
          <div className="qn-App-content">
            <RouteHandler {...this.props} />
          </div>
        </div>
      </div>
    );
  },
  renderEmptyState: function() {
    return (
      <p className="qn-App-empty">No Quick Notes have been created, yet.</p>
    );
  },
  renderSection: function(section) {
    return section.map(function(category) {

      var notes = category.notes.map(function(note) {
        return (
          <Link to="note.edit" params={{id: note.quickNoteId}}
            className="qn-Nav-item"
            activeClassName="qn-Nav-item--active">{note.title}</Link>
        );
      });

      // A category is editable if it has an id.
      var categoryName = !category.categoryId ? category.name : (
        <Link to="category.edit" params={{id: category.categoryId}}
          className="qn-Nav-item"
          activeClassName="qn-Nav-item--active">{category.name}</Link>
      );

      var navHeadingClasses = cx({
        'qn-Nav-heading': true,
        'qn-Nav-heading--unspecified': !category.categoryId
      });

      return (
        <div>
          <h2 className={navHeadingClasses}>{categoryName}</h2>
          {notes}
        </div>
      );
    });
  }
});

module.exports = App;
