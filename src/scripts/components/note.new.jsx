'use strict';

var React = require('react');

var NewNote = React.createClass({
  render: function() {
    return (
      <section className="qn-Content">
        <h2 className="qn-Content-heading">New Quick Note</h2>
        <form>
          <label className="qn-Label" htmlFor="qn-Input">Title</label>
          <input className="qn-Input" id="qn-Input"/>
          <label className="qn-Label" htmlFor="qn-Category">Category</label>
          <select id="qn-Category">
            <option>One</option>
            <option>Two</option>
          </select>
          <label className="qn-Label" htmlFor="qn-Note">Note</label>
          <textarea className="qn-Input qn-Input--textarea" id="qn-Note"></textarea>
          <div className="qn-ActionBar">
            <button className="qn-ActionBar-item qn-Button">Create Quick Note</button>
            <button className="qn-ActionBar-item qn-Button">Cancel</button>
          </div>
        </form>
      </section>
    );
  }
});

module.exports = NewNote;