'use strict';

var React = require('react');

var config = require('../config');

var NewNote = React.createClass({
  render: function() {
    return (
      <section className="qn-Content">
        <h2 className="qn-Content-heading">New Quick Note</h2>
        <form>
          <label className="qn-Label" htmlFor="qn-Input">Title</label>
          <input className="qn-Input" id="qn-Input" type="text" required
            autoFocus
            maxLength={config.NOTE_TITLE_MAXLENGTH}/>
          <label className="qn-Label" htmlFor="qn-Category">Category</label>
          <select id="qn-Category">
            <option>One</option>
            <option>Two</option>
          </select>
          <label className="qn-Label" htmlFor="qn-Note">Note</label>
          <textarea className="qn-Input qn-Input--textarea" id="qn-Note" required
            maxLength={config.NOTE_NOTE_MAXLENGTH}></textarea>
          <div className="qn-ActionBar">
            <button className="qn-ActionBar-item qn-Button qn-Button--primary">Save</button>
            <button className="qn-ActionBar-item qn-Button">Cancel</button>
          </div>
        </form>
      </section>
    );
  }
});

module.exports = NewNote;
