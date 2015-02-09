'use strict';

var React = require('react');
var Router = require('react-router');

var categoryStore = require('../stores/category');
var actions = require('../actions');

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
  render: function() {
    // Only render if there's a state.
    if( !this.state ) {
      return null;
    }

    return (
      <form className="qn-Content" onSubmit={this.onSubmit}>
        <h2 className="qn-Content-heading">Edit category</h2>
        <label className="qn-Label" for="qn-Input">Name</label>
        <input className="qn-Input" id="qn-Input" value={this.state.categoryName} onChange={this.onNameInputChange}/>
        <div className="qn-ActionBar">
          <button className="qn-ActionBar-item qn-Button" type="submit">Rename</button>
          <button className="qn-ActionBar-item qn-Button" onClick={this.onCancel}>Cancel</button>
        </div>
      </form>
    );
  },
  onStoreChange: function(category) {
    this.setState({
      // Source data.
      category: category,
      // Holds a copy of category data to be modified by user input.
      categoryName: category.name
    })
  },
  onNameInputChange: function(e) {
    this.setState({
      categoryName: e.target.value
    });
  },
  onSubmit: function(e) {
    e.preventDefault();
    actions.renameCategory(this.state.category.id, this.state.categoryName);
    this.onCancel();
  },
  onCancel: function() {
    this.transitionTo('home');
  }
});

module.exports = EditCategory;
