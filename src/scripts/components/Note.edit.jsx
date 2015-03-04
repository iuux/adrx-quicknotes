'use strict';

var React = require('react');
var Router = require('react-router');

var noteStore = require('../stores/note');
var actions = require('../actions');
var config = require('../config');

var Alert = require('./Alert');
var CategorySelector = require('./CategorySelector');
var Dialog = require('./Dialog');

var EditNote = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.listenTo(noteStore, 'onStoreChange'),
    Reflux.listenToMany(actions)
  ],
  statics: {
    // Get the note by its id when transitioning to this component.
    willTransitionTo: function(transition, params) {
      actions.getNote(params.id);
    }
  },
  //
  // Store methods
  //
  onStoreChange: function(note) {
    this.sourceState = note;
    // Holds a copy of source data to be modified by user input.
    this.setState({
      title: note.title,
      categoryId: note.categoryId || 0,
      newCategoryName: '',
      body: note.body || ''
    });
    // Change focus to first input field.
    this.refs.qnInput.getDOMNode().focus();
  },
  //
  // Render methods
  //
  render: function() {
    // Only render if there's a state.
    if( !this.state ) {
      return null;
    }

    this.checkValidity();

    var isSubmitDisabled = this.isInvalid;
    var submitButtonLabel = this.state.requesting ? 'Saving' : 'Save';
    var processIndicator = this.state.requesting ? (<span className="qn-ProcessIndicator"/>) : null;

    var hasError = !!this.state.errorMessage;
    var error = !hasError ? null : (
      <Alert type="error" ref="error" message={this.state.errorMessage}/>
    );

    var isFormDisabled = this.state.requesting;

    var dialogMessage = (
      <span>Delete <em>{this.state.title}</em>?</span>
    );

    return (
      <form className="qn-Content" onSubmit={this.handleSubmit}>
        <h2 className="qn-Content-heading">Edit Quick Note</h2>
        <fieldset className="qn-Fieldset" disabled={isFormDisabled}>
          {error}
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
            maxLength={config.NOTE_BODY_MAXLENGTH}
            value={this.state.body}
            onChange={this.handleNoteInputChange}></textarea>
          <div className="qn-ActionBar">
            <button className="qn-ActionBar-item qn-Button qn-Button--primary" type="submit"
              disabled={isSubmitDisabled}>
              {submitButtonLabel}
              {processIndicator}</button>
            <button className="qn-ActionBar-item qn-Button"
              onClick={this.handleDeleteDialog}>Delete</button>
            <button className="qn-ActionBar-item qn-Button"
              onClick={this.handleCancel}>Cancel</button>
          </div>
        </fieldset>
        <Dialog
          confirmationButtonLabel="Yes, delete"
          message={dialogMessage}
          show={this.state.showDeleteDialog}
          onCancel={this.handleDeleteDialogCancel}
          onConfirm={this.handleDeleteDialogConfirm}/>
      </form>
    );
  },
  checkValidity: function() {
    var hasInput, inputDiff, catDiff;
    // Fields need input, not including whitespace.
    hasInput = !!(this.state.title).trim().length;
    hasInput &= !!(this.state.body).trim().length;
    // Input is different than source data.
    inputDiff = this.state.title !== this.sourceState.title;
    inputDiff |= this.state.body !== this.sourceState.body;
    // Category is different than source data.
    catDiff =  !!this.state.newCategoryName && !!this.state.newCategoryName.length;
    catDiff |= this.state.categoryId !== this.sourceState.categoryId;
    // Combine validity checks.
    // Valid means there are differences which can be saved.
    this.isValid = hasInput && (inputDiff || catDiff);
    this.isInvalid = !this.isValid;
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
    actions.updateNote(this.sourceState.quickNoteId, this.state);
    this.setState({
      requesting: true,
      errorMessage: null
    });
  },
  handleDeleteDialog: function(e) {
    e.preventDefault();
    this.setState({
      showDeleteDialog: true
    });
  },
  handleDeleteDialogCancel: function() {
    this.setState({
      showDeleteDialog: false
    });
  },
  handleDeleteDialogConfirm: function() {
    this.setState({
      showDeleteDialog: false
    });
    //actions.deleteNote(this.sourceState.quickNoteId);
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
  onUpdateNoteSucceeded: function(id) {
    this.handleCancel();
  },
  onUpdateNoteFailed: function(message) {
    this.setState({
      requesting: false,
      errorMessage: message
    }, this.onUpdateNoteFailedCallback);
  },
  onUpdateNoteFailedCallback: function() {
    this.refs.error.getDOMNode().focus();
  },
  onDeleteNoteSucceeded: function(id) {
    this.handleCancel();
  }
});

module.exports = EditNote;
