'use strict';

var React = require('react');
var Router = require('react-router');

var noteStore = require('../stores/note');
var actions = require('../actions');

var EditNote = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.connect(noteStore, 'note')
  ],
  statics: {
    // Get the note by its id when transitioning to this component.
    willTransitionTo: function(transition, params) {
      actions.getNote(params.id);
    }
  },
  render: function() {
    var note = this.state.note;

    if( !note ) {
      return null;
    }

    // Ensure the note is at least a string, so the component is renderable.
    var qnNote = note.note ? note.note : '';

    return (
      <section className="qn-Content">
        <h2 className="qn-Content-heading">Edit Quick Note</h2>
        <form>
          <label className="qn-Label" htmlFor="qn-Input">Title</label>
          <input className="qn-Input" id="qn-Input" value={note.title}/>
          <label className="qn-Label" htmlFor="qn-Category">Category</label>
          <select id="qn-Category">
            <option>One</option>
            <option>Two</option>
          </select>
          <label className="qn-Label" htmlFor="qn-Note">Note</label>
          <textarea className="qn-Input qn-Input--textarea" id="qn-Note" value={qnNote}></textarea>
          <div className="qn-ActionBar">
            <button className="qn-ActionBar-item qn-Button">Save</button>
            <button className="qn-ActionBar-item qn-Button" onClick={this.cancel}>Cancel</button>
          </div>
        </form>
      </section>
    );
  },
  cancel: function() {
    this.transitionTo('home');
  }
});

module.exports = EditNote;
