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

var Alert = require('./Alert');
var Modal = require('./Modal');
var Dialog = require('./Dialog');

var App = React.createClass({
  mixins: [
    Router.State,
    Reflux.connect(categorizedNotesStore, 'categorizedNotes'),
    Reflux.listenToMany(actions)
  ],
  componentDidMount: function() {
    actions.getData();
  },
  getInitialState: function() {
    return {
      showModal: true
    };
  },
  render: function() {
    var buttonStyle = this.state.loaded ? null : { visibility: 'hidden' };
    var processIndicator = this.state.requesting ? (<span className="qn-ProcessIndicator"/>) : null;

    var error = this.state.errorMessage ? this.renderError() : null;

    var hasData = quickNotesStore.hasData();
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
        <p>
          <button className="qn-Button" onClick={this.showModal}>Show modal</button>
        </p>
        <Modal show={this.state.showModal} onClose={this.handleModalClose}>
          <Dialog/>
        </Modal>
        {error}
        {body}
      </section>
    );
  },
  showModal: function(e) {
    e.preventDefault();
    this.setState({
      showModal: true
    });
  },
  handleModalClose: function() {
    this.setState({
      showModal: false
    });
  },
  renderError: function() {
    return (
      <div className="qn-App-error">
        <Alert type="error" ref="error" message={this.state.errorMessage}/>
      </div>
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
  },
  onGetDataCalled: function() {
    this.setState({
      requesting: true,
      loaded: false,
      errorMessage: null
    });
  },
  onGetDataSucceeded: function() {
    this.setState({
      requesting: false,
      loaded: true
    });
  },
  onGetDataFailed: function(message) {
    this.setState({
      requesting: false,
      loaded: false,
      errorMessage: message
    }, this.onGetDataFailedCallback);
  },
  onGetDataFailedCallback: function() {
    this.refs.error.getDOMNode().focus();
  }
});

module.exports = App;
