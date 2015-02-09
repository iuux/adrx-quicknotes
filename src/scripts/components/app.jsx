'use strict';

var React = require('react');
var Reflux = require('reflux');
var categorizedNotesStore = require('../stores/categorizedNotes');
var actions = require('../actions');

var App = React.createClass({
  mixins: [
    Reflux.connect(categorizedNotesStore, 'categorizedNotes')
  ],
  render: function() {

    function renderSection(section) {
      return section.map(function(category) {

        var notes = category.notes.map(function(note) {
          return (
            <a className="qn-Nav-item">{note.title}</a>
          );
        });

        // A category is editable if it has an id.
        var edit = !!category.id ? <a>Edit</a> : null;

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

    var data = this.state.categorizedNotes;
    var categorizedSection = renderSection(data.categorized);
    var uncategorizedSection = renderSection([data.uncategorized]);

    return (
      <section className="qn-App">
        <header className="qn-Header">
          <h1 className="qn-Header-heading"><a ui-sref="app">Quick Notes</a></h1>
          <a className="qn-Button" ui-sref="app.note.new" onClick={this.doSomethingHandler}>New Quick Note</a>
        </header>
        <div className="qn-App-body">
          <nav className="qn-App-nav qn-Nav">
            {categorizedSection}
            {uncategorizedSection}
          </nav>
          <div className="qn-App-content" ui-view></div>
        </div>
      </section>
    );
  },
  doSomethingHandler: function() {
    actions.doSomething();
  }
});

module.exports = App;
