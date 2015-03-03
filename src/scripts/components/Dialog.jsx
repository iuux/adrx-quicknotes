'use strict';

var React = require('react');

var Dialog = React.createClass({
  render: function() {
    return (
      <section className="qn-Dialog" tabIndex="0" role="dialog">
        <p className="qn-Dialog-content">Delete this Quick Note?</p>
        <div className="qn-Dialog-actions">
          <button className="qn-Dialog-action qn-Button">Yes, delete</button>
          <button className="qn-Dialog-action qn-Button">No</button>
        </div>
      </section>
    );
  }
});

module.exports = Dialog;
