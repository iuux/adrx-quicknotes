'use strict';

var React = require('react');
var Router = require('react-router');

var noteStore = require('../stores/note');
var actions = require('../actions');
var config = require('../config');

var Alert = require('./Alert');
var CategorySelector = require('./CategorySelector');

var NewNote = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.listenToMany(actions)
  ],
  //
  // Lifecycle methods
  //
  getInitialState: function() {
    return {
      title: '',
      categoryId: 0,
      newCategoryName: '',
      body: ''
    };
  },
  //
  // Render methods
  //
  render: function() {
    this.checkValidity();

    var submitButtonLabel = !this.state.requesting ? 'Save' : (
      <span>Saving <span className="qn-ProcessIndicator"/></span>
    );

    var error = !this.state.errorMessage ? null : (
      <Alert
        message={this.state.errorMessage}
        ref="error"
        type="error"/>
    );

    var isFormDisabled = this.state.requesting;

    return (
      <form
        className="qn-Content"
        onSubmit={this.handleSubmit}>
        <h2 className="qn-Content-heading">
          New Quick Note
        </h2>
        <fieldset
          className="qn-Fieldset"
          disabled={isFormDisabled}>
          {error}
          <label
            className="qn-Label"
            htmlFor="qn-Input">
            Title
          </label>
          <input
            autoFocus
            className="qn-Input"
            id="qn-Input"
            maxLength={config.NOTE_TITLE_MAXLENGTH}
            onChange={this.handleTitleInputChange}
            ref="qnInput"
            required
            type="text"
            value={this.state.title}/>
          <CategorySelector
            disabled={isFormDisabled}
            newCategoryName={this.state.newCategoryName}
            onChange={this.handleCategorySelectorChange}
            selectedCategoryId={this.state.categoryId}/>
          <label
            className="qn-Label"
            htmlFor="qn-Note">
            Note
          </label>
          <textarea
            className="qn-Input qn-Input--textarea"
            id="qn-Note"
            maxLength={config.NOTE_BODY_MAXLENGTH}
            onChange={this.handleNoteInputChange}
            required
            value={this.state.body}>
          </textarea>
          <div className="qn-ActionBar">
            <button
              className="qn-ActionBar-item qn-Button qn-Button--primary"
              disabled={this.isInvalid}
              type="submit">
              {submitButtonLabel}
            </button>
            <button
              className="qn-ActionBar-item qn-Button"
              onClick={this.handleCancel}>
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    );
  },
  //
  // Handler methods
  //
  handleTitleInputChange: function(e) {
    this.setState({
      title: e.target.value
    });
  },
  handleCategorySelectorChange: function(e) {
    this.setState({
      categoryId: e.categoryId,
      newCategoryName: e.newCategoryName || null
    });
  },
  handleNoteInputChange: function(e) {
    this.setState({
      body: e.target.value
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    actions.createNote(this.state);
    this.setState({
      requesting: true
    });
  },
  handleCancel: function(e) {
    if(!!e) {
      e.preventDefault();
    }
    this.transitionTo('home');
  },
  //
  // Action methods
  //
  onCreateNoteSucceeded: function(note) {
    this.handleCancel();
  },
  onCreateNoteFailed: function(message) {
    this.setState({
      requesting: false,
      errorMessage: message
    }, function() {
      this.refs.error.getDOMNode().focus();
    });
  },
  //
  // Helper methods
  //
  checkValidity: function() {
    var hasInput, inputDiff, catDiff;
    // Fields need input, not including whitespace.
    hasInput = !!(this.state.title).trim().length;
    hasInput &= !!(this.state.body).trim().length;
    // Combine validity checks.
    // Valid means there are differences which can be saved.
    this.isValid = hasInput;
    this.isInvalid = !this.isValid;
  }
});

module.exports = NewNote;
