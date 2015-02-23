'use strict';

var React = require('react');
var Router = require('react-router');

var noteStore = require('../stores/note');
var actions = require('../actions');
var config = require('../config');

var CategorySelector = require('./CategorySelector');

var NewNote = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.listenToMany(actions)
  ],
  getInitialState: function() {
    return {
      title: '',
      categoryId: 0,
      newCategoryName: '',
      body: ''
    };
  },
  render: function() {
    this.checkValidity();

    var isSubmitDisabled = this.isInvalid;
    var submitButtonLabel = this.state.requesting ? 'Saving' : 'Save';
    var processIndicator = this.state.requesting ? (<span className="qn-ProcessIndicator"/>) : null;

    var isFormDisabled = this.state.requesting;

    return (
      <form className="qn-Content" onSubmit={this.handleSubmit}>
        <h2 className="qn-Content-heading">New Quick Note</h2>
        <fieldset className="qn-Fieldset" disabled={isFormDisabled}>
          <label className="qn-Label" htmlFor="qn-Input">Title</label>
          <input className="qn-Input" id="qn-Input" type="text" required
            ref="qnInput" autoFocus
            maxLength={config.NOTE_TITLE_MAXLENGTH}
            value={this.state.title}
            onChange={this.handleTitleInputChange}/>
          <CategorySelector
            selectedCategoryId={this.state.categoryId}
            newCategoryName={this.state.newCategoryName}
            onChange={this.handleCategorySelectorChange}
            disabled={isFormDisabled}/>
          <label className="qn-Label" htmlFor="qn-Note">Note</label>
          <textarea className="qn-Input qn-Input--textarea" id="qn-Note" required
            maxLength={config.NOTE_NOTE_MAXLENGTH}
            value={this.state.body}
            onChange={this.handleNoteInputChange}></textarea>
          <div className="qn-ActionBar">
            <button className="qn-ActionBar-item qn-Button qn-Button--primary" type="submit"
              disabled={isSubmitDisabled}>
              {submitButtonLabel}
              {processIndicator}</button>
            <button className="qn-ActionBar-item qn-Button"
              onClick={this.handleCancel}>Cancel</button>
          </div>
        </fieldset>
      </form>
    );
  },
  checkValidity: function() {
    var hasInput, inputDiff, catDiff;
    // Fields need input, not including whitespace.
    hasInput = !!(this.state.title).trim().length;
    hasInput &= !!(this.state.body).trim().length;
    // Combine validity checks.
    // Valid means there are differences which can be saved.
    this.isValid = hasInput;
    this.isInvalid = !this.isValid;
  },
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
  onCreateNoteSucceeded: function(note) {
    this.handleCancel();
  },
  handleCancel: function() {
    this.transitionTo('home');
  }
});

module.exports = NewNote;
