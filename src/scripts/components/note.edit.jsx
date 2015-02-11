'use strict';

var React = require('react');
var Router = require('react-router');

var noteStore = require('../stores/note');
var actions = require('../actions');
var config = require('../config');

var EditNote = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.listenTo(noteStore, 'onStoreChange')
  ],
  statics: {
    // Get the note by its id when transitioning to this component.
    willTransitionTo: function(transition, params) {
      actions.getNote(params.id);
    }
  },
  onStoreChange: function(note) {
    this.sourceState = note;
    // Holds a copy of source data to be modified by user input.
    this.setState({
      title: note.title,
      categoryId: note.categoryId,
      note: note.note || ''
    });
    // Change focus to first input field.
    this.refs.qnInput.getDOMNode().focus();
  },
  render: function() {
    // Only render if there's a state.
    if( !this.state ) {
      return null;
    }

    this.checkValidity();

    return (
      <form className="qn-Content" onSubmit={this.onSubmit}>
        <h2 className="qn-Content-heading">Edit Quick Note</h2>
        <label className="qn-Label" htmlFor="qn-Input">Title</label>
        <input className="qn-Input" id="qn-Input" type="text" required
          ref="qnInput" autoFocus
          maxLength={config.NOTE_TITLE_MAXLENGTH}
          value={this.state.title}
          onChange={this.onTitleInputChange}/>
        <label className="qn-Label" htmlFor="qn-Category">Category</label>
        <select id="qn-Category">
          <option>One</option>
          <option>Two</option>
        </select>
        <label className="qn-Label" htmlFor="qn-Note">Note</label>
        <textarea className="qn-Input qn-Input--textarea" id="qn-Note" required
          maxLength={config.NOTE_NOTE_MAXLENGTH}
          value={this.state.note}
          onChange={this.onNoteInputChange}></textarea>
        <div className="qn-ActionBar">
          <button className="qn-ActionBar-item qn-Button qn-Button--primary" type="submit"
            disabled={this.isInvalid}>Save</button>
          <button className="qn-ActionBar-item qn-Button"
            onClick={this.onCancel}>Cancel</button>
        </div>
      </form>
    );
  },
  checkValidity: function() {
    var hasInput, diff;
    // Fields need input, not including whitespace.
    hasInput = !!(this.state.title).trim().length;
    hasInput &= !!(this.state.note).trim().length;
    // Input is different than source data.
    diff = this.state.title !== this.sourceState.title;
    diff |= this.state.note !== this.sourceState.note;
    // Combine validity checks.
    this.isValid = hasInput && diff;
    this.isInvalid = !this.isValid;
  },
  onTitleInputChange: function(e) {
    this.setState({
      title: e.target.value
    });
  },
  onNoteInputChange: function(e) {
    this.setState({
      note: e.target.value
    });
  },
  onSubmit: function(e) {
    e.preventDefault();
    actions.updateNote(this.sourceState.id, this.state);
    this.onCancel();
  },
  onCancel: function() {
    this.transitionTo('home');
  }
});

module.exports = EditNote;
