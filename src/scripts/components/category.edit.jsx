'use strict';

var React = require('react');
var Router = require('react-router');

var categoryStore = require('../stores/category');
var actions = require('../actions');

var EditCategory = React.createClass({
  mixins: [
    Router.Navigation,
    Reflux.connect(categoryStore, 'category')
  ],
  statics: {
    // Get the note by its id when transitioning to this component.
    willTransitionTo: function(transition, params) {
      actions.getCategory(params.id);
    }
  },
  render: function() {
    var category = this.state.category;

    if( !category ) {
      return null;
    }

    return (
      <form className="qn-Content">
        <h2 className="qn-Content-heading">Edit category</h2>
        <label className="qn-Label" for="qn-Input">Name</label>
        <input className="qn-Input" id="qn-Input" value={category.name}/>
        <div className="qn-ActionBar">
          <button className="qn-ActionBar-item qn-Button" type="submit">Rename</button>
          <button className="qn-ActionBar-item qn-Button" onClick={this.cancel}>Cancel</button>
        </div>
      </form>
    );
  },
  cancel: function() {
    this.transitionTo('home');
  }
});

module.exports = EditCategory;
