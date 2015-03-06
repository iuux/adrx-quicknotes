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
  // Lifecycle methods
  //
  componentWillUnmount: function() {
    // Destroy the CKEditor instance.
    // Destroying will also remove any event listeners.
    if(!!this.editor) {
      this.editor.destroy();
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
    // Replace the textarea with a CKEditor instance.
    if(!this.editor) {
      this.editor = window.CKEDITOR.replace('qn-Note', config.CKEDITOR);
      this.editor.on('change', this.handleNoteInputChange);
    }
    // Set the data.
    this.editor.setData(this.state.body);
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

    var submitButtonLabel = !this.state.requestingSubmit ? 'Save' : (
      <span>Saving <span className="qn-ProcessIndicator"/></span>
    );

    var deleteButtonLabel = !this.state.requestingDelete ? 'Delete' : (
      <span>Deleting <span className="qn-ProcessIndicator"/></span>
    );

    var error = !this.state.errorMessage ? null : (
      <Alert
        message={this.state.errorMessage}
        ref="error"
        type="error"/>
    );

    var isFormDisabled = this.state.requestingSubmit || this.state.requestingDelete;

    var dialogMessage = (
      <span>Delete <em>{this.state.title}</em>?</span>
    );

    return (
      <form
        className="qn-Content"
        onSubmit={this.handleSubmit}>
        <h2 className="qn-Content-heading">
          Edit Quick Note
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
              onClick={this.handleDeleteDialog}>
              {deleteButtonLabel}
            </button>
            <button
              className="qn-ActionBar-item qn-Button"
              onClick={this.handleCancel}>
              Cancel
            </button>
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
    var value = e.editor.getData();
    this.setState({
      body: value
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    actions.updateNote(this.sourceState.quickNoteId, this.state);
    this.setState({
      requestingSubmit: true,
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
      requestingDelete: true,
      showDeleteDialog: false
    });
    actions.deleteNote(this.sourceState.quickNoteId);
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
      requestingSubmit: false,
      errorMessage: message
    }, this.setFocusToError);
  },
  onDeleteNoteSucceeded: function() {
    this.handleCancel();
  },
  onDeleteNoteFailed: function(message) {
    this.setState({
      requestingDelete: false,
      errorMessage: message
    }, this.setFocusToError);
  },
  //
  // Helper methods
  //
  setFocusToError: function() {
    this.refs.error.getDOMNode().focus();
  }
});

module.exports = EditNote;
