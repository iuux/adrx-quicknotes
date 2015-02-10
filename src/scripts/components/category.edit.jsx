'use strict';

var React = require('react');
var Router = require('react-router');

var categoryStore = require('../stores/category');
var actions = require('../actions');
var config = require('../config');

var EditCategory = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.listenTo(categoryStore, 'onStoreChange')
  ],
  statics: {
    // Get the note by its id when transitioning to this component.
    willTransitionTo: function(transition, params) {
      actions.getCategory(params.id);
    }
  },
  onStoreChange: function(category) {
    this.sourceState = category;
    // Holds a copy of category data to be modified by user input.
    this.setState({
      name: category.name
    });
  },
  render: function() {
    // Only render if there's a state.
    if( !this.state ) {
      return null;
    }

    this.checkValidity();

    return (
      <form className="qn-Content" onSubmit={this.onSubmit}>
        <h2 className="qn-Content-heading">Edit category</h2>
        <label className="qn-Label" for="qn-Input">Name</label>
        <input className="qn-Input" id="qn-Input" type="text" required
          maxLength={config.CATEGORY_NAME_MAXLENGTH}
          value={this.state.name}
          onChange={this.onNameInputChange}/>
        <div className="qn-ActionBar">
          <button className="qn-ActionBar-item qn-Button" type="submit"
            disabled={this.isInvalid}>Rename</button>
          <button className="qn-ActionBar-item qn-Button"
            onClick={this.onCancel}>Cancel</button>
        </div>
      </form>
    );
  },
  checkValidity: function() {
    var hasInput, diff;
    // Fields need input, not including whitespace.
    hasInput = !!(this.state.name).trim().length;
    // Input is different than source data.
    diff = this.state.name !== this.sourceState.name;
    // Combine validity checks.
    this.isValid = hasInput && diff;
    this.isInvalid = !this.isValid;
  },
  onNameInputChange: function(e) {
    this.setState({
      name: e.target.value
    });
  },
  onSubmit: function(e) {
    e.preventDefault();
    actions.renameCategory(this.sourceState.id, this.state.name);
    this.onCancel();
  },
  onCancel: function() {
    this.transitionTo('home');
  }
});

module.exports = EditCategory;
