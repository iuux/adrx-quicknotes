'use strict';

var React = require('react');
var cx = React.addons.classSet;
var Reflux = require('reflux');

var categorizedNotesStore = require('../stores/categorizedNotes');
var Icon = require('./icon');

var CategorySelector = React.createClass({
  mixins: [
    Reflux.connect(categorizedNotesStore, 'categorizedNotes')
  ],
  getInitialState: function() {
    return {
      showOptions: false
    };
  },
  render: function() {
    var categoryList = this.state.categorizedNotes.categorized;
    var unspecifiedCategory = this.state.categorizedNotes.uncategorized;

    var isSelectedUncategoried = !this.props.selectedCategoryId;

    var selectedClasses = cx({
      'qn-CategorySelector-selected': true,
      'qn-CategorySelector-selected--unspecified': isSelectedUncategoried
    });

    var selectedCategory = isSelectedUncategoried ? unspecifiedCategory : (
      categoryList.filter(function(category) {
        return category.id == this.props.selectedCategoryId;
      }.bind(this))[0]
    );

    categoryList = categoryList.map(this.renderCategoryRadioInput);
    unspecifiedCategory = [unspecifiedCategory].map(this.renderCategoryRadioInput);

    var fieldsetClasses = cx({
      'qn-CategorySelector-options': true,
      'qn-CategorySelector-options--hide': !this.state.showOptions
    });

    var options = (
      <fieldset className={fieldsetClasses}>
        <legend className="qn-CategorySelector-legend">Category</legend>
        {categoryList}
        {unspecifiedCategory}
        <div className="qn-CategorySelector-option qn-CategorySelector-option--newCategory">
          <label className="qn-CategorySelector-inputLabel"
            htmlFor="newCategoryInput">New category</label>
          <input className="qn-Input" type="text" id="newCategoryInput"
            onChange={this.onNewCategoryInputChange}/>
        </div>
      </fieldset>
    );

    return (
      <div className="qn-CategorySelector">
        <label className="qn-Label">Category</label>
        <button className={selectedClasses}
          ref="toggleButton"
          onClick={this.onToggleOptions}>
          {selectedCategory.name}
          <Icon name="caret-bottom" className="qn-CategorySelector-icon"/>
        </button>
        {options}
      </div>
    );
  },
  renderCategoryRadioInput: function(category) {
    var id = category.id ? category.id : 0;
    var radioId = 'category' + id;
    var isSelected = (this.props.selectedCategoryId || 0) == id;

    var radioLabelClasses = cx({
      'qn-CategorySelector-radioLabel': true,
      'qn-CategorySelector-radioLabel--unspecified': !category.id
    });

    var icon = isSelected ? (<Icon name="check"/>) : null;

    var selectCategory = function(e) {
      this.onCategorySelection(e, id);
    }.bind(this);

    //var refId = isSelected ? 'selectedOption' : null;

    //var refId = 'categoryInput' + id;

    return (
      /*
      <a href="#" ref={refId} className={radioLabelClasses} onClick={selectCategory}>
        <span className='qn-CategorySelector-radioLabelText'>{category.name}</span>
        {icon}
      </a>
*/
      <div className="qn-CategorySelector-option">
        <input className="qn-CategorySelector-radioInput"
          id={radioId} type="checkbox" name={radioId}
          ref={radioId}
          onChange={this.onRadioInputChange}
          value={id}
          checked={isSelected} />
        <label className={radioLabelClasses}
          htmlFor={radioId}>
          <span className='qn-CategorySelector-radioLabelText'>{category.name}</span>
          {icon}
        </label>
      </div>
    );
  },
  onToggleOptions: function(e) {
    e.preventDefault();
    console.log('toggling');
    this.toggleOptions();
  },
  toggleOptions: function(e) {
    this.setState({
      showOptions: !this.state.showOptions
    });

    if(this.state.showOptions) {
      this.refs.toggleButton.getDOMNode().focus();
    }
    else {
      var refId = 'category' + this.props.selectedCategoryId;
      var ref = this.refs[refId];
      // Put focus back on the button.
      setTimeout(function() {
        ref.getDOMNode().focus();
      }, 0);
    }
  },
  /*
  onCategorySelection: function(e, id) {
    e.preventDefault();
    // Close the options.
    this.toggleOptions();
    //this.refs.toggleButton.getDOMNode().focus();
    // Inform the parent component about the change.
    this.props.onChange({
      categoryId: id
    });
  },
  */
  onRadioInputChange: function(e) {
    //e.preventDefault();
    console.log('changing check', e.target.value);
    // Close the options.
    this.toggleOptions();
    // Inform the parent component about the change.
    this.props.onChange({
      categoryId: parseInt(e.target.value)
    });
  },
  onNewCategoryInputChange: function(e) {
    console.log('new cat', e.target.value);
  }
});

module.exports = CategorySelector;
