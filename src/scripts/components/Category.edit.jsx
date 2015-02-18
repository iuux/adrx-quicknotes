'use strict';

var React = require('react');
var Router = require('react-router');

var categoryStore = require('../stores/category');
var actions = require('../actions');
var config = require('../config');

var Alert = require('./Alert');

var EditCategory = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.listenTo(categoryStore, 'onStoreChange'),
    Reflux.listenToMany(actions)
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
    // Change focus to first input field.
    this.refs.qnInput.getDOMNode().focus();
  },
  render: function() {
    // Only render if there's a state.
    if( !this.state ) {
      return null;
    }

    this.checkValidity();

    var isSubmitDisabled = this.isInvalid || this.state.requesting;
    var submitButtonLabel = this.state.requesting ? 'Renaming' : 'Rename';
    var processIndicator = this.state.requesting ? (<span className="qn-ProcessIndicator"/>) : null;

    var hasError = true;
    var error = !hasError ? null : (
      <Alert type="error" message="Could not rename category."/>
    );

    return (
      <form className="qn-Content" onSubmit={this.handleSubmit}>
        <h2 className="qn-Content-heading">Edit category</h2>
        {error}
        <label className="qn-Label" for="qn-Input">Name</label>
        <input className="qn-Input" id="qn-Input" type="text" required
          ref="qnInput" autoFocus
          maxLength={config.CATEGORY_NAME_MAXLENGTH}
          value={this.state.name}
          onChange={this.handleNameInputChange}
          disabled={this.state.requesting}/>
        <div className="qn-ActionBar">
          <button className="qn-ActionBar-item qn-Button" type="submit"
            disabled={isSubmitDisabled}>
            {submitButtonLabel}
            {processIndicator}</button>
          <button className="qn-ActionBar-item qn-Button"
            onClick={this.handleCancel}>Cancel</button>
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
  handleNameInputChange: function(e) {
    this.setState({
      name: e.target.value
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    actions.renameCategory(this.sourceState.id, this.state.name);
    this.setState({
      requesting: true
    });
  },
  handleCancel: function() {
    this.transitionTo('home');
  },
  onRenameCategorySucceeded: function(id) {
    this.onCancel();
  },
  onRenameCategoryFailed: function(id, sourceName, newName) {
    this.setState({
      requesting: false
    });
  }
});

module.exports = EditCategory;
